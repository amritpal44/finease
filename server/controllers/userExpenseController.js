const Expense = require("../models/expenseModel");
const Category = require("../models/categoryModel");
const PaymentMethod = require("../models/paymentMethodModel");
const User = require("../models/userModel");

// Get all expenses for the logged-in user (paginated)
exports.getUserExpenses = async (req, res) => {
  try {
    // Parse page and limit from query, set defaults
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const totalExpenses = await Expense.countDocuments({ user: req.user.id });

    const expenses = await Expense.find({ user: req.user.id })
      .populate("category")
      .populate("paymentMethod")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    if (expenses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No expenses found for this user.",
        expenses: [],
        pagination: {
          total: totalExpenses,
          page,
          limit,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: page > 1,
        },
      });
    }

    res.json({
      success: true,
      expenses,
      pagination: {
        total: totalExpenses,
        page,
        limit,
        totalPages: Math.ceil(totalExpenses / limit),
        hasNextPage: page * limit < totalExpenses,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
      error: error.message,
    });
  }
};

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, date, note, category, paymentMethod } = req.body;

    if (!title || !amount || !date || !category || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category." });
    }

    const paymentMethodExists = await PaymentMethod.findById(paymentMethod);
    if (!paymentMethodExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment method." });
    }

    const expense = new Expense({
      user: req.user.id,
      title,
      amount,
      date,
      note,
      category,
      paymentMethod,
    });

    await expense.save();

    // Increment category and payment method count
    await Category.findByIdAndUpdate(categoryExists._id, {
      $inc: { count: 1 },
    });
    await PaymentMethod.findByIdAndUpdate(paymentMethodExists._id, {
      $inc: { count: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create expense",
      error: error.message,
    });
  }
};

// Update an existing expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, date, note, category, paymentMethod } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Expense ID is required.",
      });
    }

    if (!title || !amount || !date || !category || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category." });
    }

    const paymentMethodExists = await PaymentMethod.findById(paymentMethod);
    if (!paymentMethodExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment method." });
    }

    // Find the existing expense to check if category or payment method is changed
    const existingExpense = await Expense.findOne({
      _id: id,
      user: req.user.id,
    });
    if (!existingExpense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    // If category changed, update counts
    if (existingExpense.category.toString() !== categoryExists._id.toString()) {
      await Category.findByIdAndUpdate(existingExpense.category, {
        $inc: { count: -1 },
      });
      await Category.findByIdAndUpdate(categoryExists._id, {
        $inc: { count: 1 },
      });
    }

    // If payment method changed, update counts
    if (
      existingExpense.paymentMethod.toString() !==
      paymentMethodExists._id.toString()
    ) {
      await PaymentMethod.findByIdAndUpdate(existingExpense.paymentMethod, {
        $inc: { count: -1 },
      });
      await PaymentMethod.findByIdAndUpdate(paymentMethodExists._id, {
        $inc: { count: 1 },
      });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, amount, date, note, category, paymentMethod },
      { new: true }
    );

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }
    res.json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update expense",
      error: error.message,
    });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Expense ID is required.",
      });
    }

    const expense = await Expense.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    // Decrement category and payment method count
    await Category.findByIdAndUpdate(expense.category, { $inc: { count: -1 } });
    await PaymentMethod.findByIdAndUpdate(expense.paymentMethod, {
      $inc: { count: -1 },
    });

    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete expense",
      error: error.message,
    });
  }
};

// Update total monthly budget for the logged-in user
exports.updateMonthlyBudget = async (req, res) => {
  try {
    const { totalMonthlyBudget } = req.body;

    if (
      totalMonthlyBudget === undefined ||
      isNaN(totalMonthlyBudget) ||
      totalMonthlyBudget < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid totalMonthlyBudget is required.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { totalMonthlyBudget },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      message: "Monthly budget updated successfully.",
      totalMonthlyBudget: user.totalMonthlyBudget,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update monthly budget.",
      error: error.message,
    });
  }
};

// Get current monthly budget for the logged-in user
exports.getMonthlyBudget = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.json({
      success: true,
      totalMonthlyBudget: user.totalMonthlyBudget || 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly budget.",
      error: error.message,
    });
  }
};