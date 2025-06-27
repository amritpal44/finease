const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: String,
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
