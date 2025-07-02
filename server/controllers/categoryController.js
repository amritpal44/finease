const Category = require("../models/categoryModel");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories.",
      error: error.message,
    });
  }
};

// Create a new category (any user)
exports.createCategory = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Category title is required.",
      });
    }

    // Check for duplicate title
    const exists = await Category.findOne({ title });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Category with this title already exists.",
      });
    }

    const category = new Category({ title, description });
    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create category.",
      error: error.message,
    });
  }
};

// Delete a category (admin only)
exports.deleteCategory = async (req, res) => {
  try {
    // Only admin can delete
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete categories.",
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required.",
      });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Delete all expenses with this category
    await Expense.deleteMany({ category: id });

    res.status(200).json({
      success: true,
      message: "Category and all related expenses deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category.",
      error: error.message,
    });
  }
};

// Add or update a category budget for the logged-in user
exports.setCategoryBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { categoryId, limit } = req.body;
    if (!categoryId || typeof limit !== "number" || limit < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid categoryId and limit are required.",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    // Check if budget for this category exists
    const idx = user.categoryBudgets.findIndex(
      (b) => b.category.toString() === categoryId
    );
    if (idx > -1) {
      user.categoryBudgets[idx].limit = limit;
    } else {
      user.categoryBudgets.push({ category: categoryId, limit });
    }
    await user.save();
    res.json({ success: true, categoryBudgets: user.categoryBudgets });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to set category budget.",
      error: error.message,
    });
  }
};

// Delete a category budget for the logged-in user
exports.deleteCategoryBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { categoryId } = req.body;
    if (!categoryId) {
      return res
        .status(400)
        .json({ success: false, message: "categoryId is required." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    user.categoryBudgets = user.categoryBudgets.filter(
      (b) => b.category.toString() !== categoryId
    );
    await user.save();
    res.json({ success: true, categoryBudgets: user.categoryBudgets });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category budget.",
      error: error.message,
    });
  }
};

// Get all unique categories used by the user in their expenses
exports.getUserExpenseCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all expenses for the user and get unique category IDs
    const categories = await Expense.distinct("category", { user: userId });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user expense categories.",
      error: error.message,
    });
  }
};

// Sync all categories used in expenses into user's categoryBudgets array (if not present, add with limit -1)
exports.syncUserCategoryBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    // Get all unique categories from expenses
    const categories = await Expense.distinct("category", { user: userId });
    let updated = false;
    categories.forEach((catId) => {
      if (
        !user.categoryBudgets.some(
          (b) => b.category.toString() === catId.toString()
        )
      ) {
        user.categoryBudgets.push({ category: catId, limit: -1 });
        updated = true;
      }
    });
    if (updated) await user.save();
    res.json({ success: true, categoryBudgets: user.categoryBudgets });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to sync user category budgets.",
      error: error.message,
    });
  }
};
