const Expense = require("../models/expenseModel");

// Get expenses grouped by day for a given date range (or current month by default)
exports.getExpensesByDayInRange = async (req, res) => {
  try {
    const userId = req.user.id;
    let { startDate, endDate } = req.query;

    // If no dates provided, use current month
    const now = new Date();
    if (!startDate) {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(startDate);
    }
    if (!endDate) {
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else {
      endDate = new Date(endDate);
      endDate.setHours(23, 59, 59, 999); // include the whole end day
    }

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD.",
      });
    }

    // Fetch all expenses for the user in the date range
    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    })
      .populate("category")
      .populate("paymentMethod")
      .sort({ date: 1 });

    // Group expenses by day (YYYY-MM-DD)
    const grouped = {};
    expenses.forEach(exp => {
      const day = exp.date.toISOString().slice(0, 10);
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push({
        _id: exp._id,
        amount: exp.amount,
        title: exp.title,
        note: exp.note,
        category: exp.category ? { _id: exp.category._id, title: exp.category.title } : null,
        paymentMethod: exp.paymentMethod ? { _id: exp.paymentMethod._id, title: exp.paymentMethod.title } : null,
        date: exp.date,
        createdAt: exp.createdAt,
      });
    });

    // Convert grouped object to array of { day, expenses }
    const result = Object.keys(grouped).sort().map(day => ({
      day,
      expenses: grouped[day]
    }));

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses by day",
      error: error.message,
    });
  }
};