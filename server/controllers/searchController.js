const Expense = require("../models/expenseModel");
const Category = require("../models/categoryModel");
const PaymentMethod = require("../models/paymentMethodModel");
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Search expenses by keyword across multiple fields with pagination and relevance scoring
exports.searchExpenses = async (req, res) => {
  try {
    const { q } = req.query;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    if (!q || typeof q !== "string" || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search string (q) is required.",
      });
    }

    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(escapeRegExp(q), "i");

    const allExpenses = await Expense.find({ user: req.user.id })
      .populate("category")
      .populate("paymentMethod");

    // Filter by keyword in any field
    const filtered = allExpenses.filter((exp) => {
      const fields = [
        exp.title,
        exp.note,
        exp.category?.title,
        exp.paymentMethod?.title,
      ];
      return fields.some((field) => field && searchRegex.test(field));
    });

    // Relevance scoring
    const matchPercent = (input, target) => {
      if (!input || !target) return 0;
      input = input.toLowerCase();
      target = target.toLowerCase();
      if (input === target) return 100;
      if (target.startsWith(input)) return (input.length / target.length) * 100;
      if (target.includes(input)) return (input.length / target.length) * 100;
      return 0;
    };

    filtered.sort((a, b) => {
      const aMatch = Math.max(
        matchPercent(q, a.title),
        matchPercent(q, a.note),
        matchPercent(q, a.category?.title),
        matchPercent(q, a.paymentMethod?.title)
      );
      const bMatch = Math.max(
        matchPercent(q, b.title),
        matchPercent(q, b.note),
        matchPercent(q, b.category?.title),
        matchPercent(q, b.paymentMethod?.title)
      );
      return bMatch - aMatch;
    });

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    res.json({
      success: true,
      expenses: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search expenses",
      error: error.message,
    });
  }
};

// Get filtered expenses based on date range, payment method, and category
exports.getFilteredExpenses = async (req, res) => {
  try {
    let { startDate, endDate, paymentMethod, category, page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    const skip = (page - 1) * limit;

    // Build dynamic filter
    const filter = { user: req.user.id };

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start)) {
          return res.status(400).json({ success: false, message: "Invalid startDate format. Use YYYY-MM-DD." });
        }
        filter.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end)) {
          return res.status(400).json({ success: false, message: "Invalid endDate format. Use YYYY-MM-DD." });
        }
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // Payment method filter (expects ObjectId string)
    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    // Category filter (expects ObjectId string)
    if (category) {
      filter.category = category;
    }

    const total = await Expense.countDocuments(filter);

    const expenses = await Expense.find(filter)
      .populate("category")
      .populate("paymentMethod")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      expenses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
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