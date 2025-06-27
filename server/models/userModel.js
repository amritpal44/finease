const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  accountType: { type: String, enum: ["Admin", "User"], default: "User" },

  // Limits
  totalMonthlyBudget: { type: Number, default: 0 },
  categoryBudgets: [
    {
      category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
      limit: Number,
    },
  ],
  paymentMethodBudgets: [
    {
      paymentMethod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentMethod",
      },
      limit: Number,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
