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

module.exports = router;