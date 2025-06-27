const express = require("express");
const router = express.Router();
const paymentMethodController = require("../controllers/paymentMethodController");
const { auth, isAdmin } = require("../middleware/auth");

// Get all payment methods (any authenticated user)
router.get("/", auth, paymentMethodController.getAllPaymentMethods);

// Create a new payment method (any authenticated user)
router.post("/", auth, paymentMethodController.createPaymentMethod);

// Delete a payment method (admin only)
router.delete("/:id", auth, isAdmin, paymentMethodController.deletePaymentMethod);

module.exports = router;