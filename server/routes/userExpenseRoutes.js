const express = require("express");
const router = express.Router();
const userExpenseController = require("../controllers/userExpenseController");
const { auth } = require("../middleware/auth");

// Get all expenses for the logged-in user (paginated)
router.get("/", auth, userExpenseController.getUserExpenses);

// Create a new expense
router.post("/", auth, userExpenseController.createExpense);

// Update an existing expense
router.put("/:id", auth, userExpenseController.updateExpense);

// Delete an expense
router.delete("/:id", auth, userExpenseController.deleteExpense);

// Update total monthly budget for the logged-in user
router.patch("/budget", auth, userExpenseController.updateMonthlyBudget);

module.exports = router;