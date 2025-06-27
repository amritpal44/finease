const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const { auth } = require("../middleware/auth");

// Search expenses by keyword (title, note, category, payment method)
router.get("/search", auth, searchController.searchExpenses);

// Get expenses filtered by date range, payment method, and category
router.get("/filter", auth, searchController.getFilteredExpenses);

module.exports = router;