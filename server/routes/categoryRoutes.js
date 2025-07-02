const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { auth, isAdmin } = require("../middleware/auth");

// Get all categories (any authenticated user)
router.get("/", auth, categoryController.getAllCategories);

// Create a new category (any authenticated user)
router.post("/", auth, categoryController.createCategory);

// Delete a category (admin only)
router.delete("/:id", auth, isAdmin, categoryController.deleteCategory);

// Set or update a category budget for the logged-in user
router.post("/budget", auth, categoryController.setCategoryBudget);

// Delete a category budget for the logged-in user
router.delete("/budget", auth, categoryController.deleteCategoryBudget);

// Get all unique categories used by the user in their expenses
router.get(
  "/user-expense-categories",
  auth,
  categoryController.getUserExpenseCategories
);

// Sync all categories used in expenses into user's categoryBudgets array
router.post(
  "/sync-category-budgets",
  auth,
  categoryController.syncUserCategoryBudgets
);

module.exports = router;
