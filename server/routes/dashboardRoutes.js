const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { auth } = require("../middleware/auth");

// Get expenses grouped by day for a given date range (or current month by default)
router.get("/expenses-by-day", auth, dashboardController.getExpensesByDayInRange);

module.exports = router;