const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: String,
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
