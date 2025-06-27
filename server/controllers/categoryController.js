const Category = require("../models/categoryModel");
const Expense = require("../models/expenseModel");


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
