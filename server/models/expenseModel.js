const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    note: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
