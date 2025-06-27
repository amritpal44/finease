const PaymentMethod = require("../models/paymentMethodModel");
const Expense = require("../models/expenseModel");

// Get all payment methods (any user)
exports.getAllPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find();
    res.json({
      success: true,
      paymentMethods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment methods.",
      error: error.message,
    });
  }
};

// Create a new payment method (any user)
exports.createPaymentMethod = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Payment method title is required.",
      });
    }

    // Check for duplicate title
    const exists = await PaymentMethod.findOne({ title });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Payment method with this title already exists.",
      });
    }

    const paymentMethod = new PaymentMethod({ title, description });
    await paymentMethod.save();

    res.status(201).json({
      success: true,
      message: "Payment method created successfully.",
      paymentMethod,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create payment method.",
      error: error.message,
    });
  }
};

// Delete a payment method (admin only)
exports.deletePaymentMethod = async (req, res) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete payment methods.",
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Payment method ID is required.",
      });
    }

    const paymentMethod = await PaymentMethod.findByIdAndDelete(id);
    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: "Payment method not found.",
      });
    }

    // Delete all expenses with this payment method
    await Expense.deleteMany({ paymentMethod: id });

    res.status(200).json({
      success: true,
      message: "Payment method and all related expenses deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete payment method.",
      error: error.message,
    });
  }
};
