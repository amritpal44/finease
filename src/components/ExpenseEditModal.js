// components/ExpenseEditModal.js
import React, { useState, useEffect } from "react";
import Modal from "./Modal"; // You'll need to create a Modal component
import CategorySelect from "./CategorySelect";
import PaymentMethodSelect from "./PaymentMethodSelect";
import { createCategory, createPaymentMethod } from "../utils/api";
import { useAuth } from "../hooks/useAuth";

export default function ExpenseEditModal({
  isOpen,
  onClose,
  expense,
  categories,
  paymentMethods,
  onSave,
  fetchCategoriesAndPaymentMethods,
}) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: "",
    paymentMethod: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingPaymentMethod, setIsCreatingPaymentMethod] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newPaymentMethodName, setNewPaymentMethodName] = useState("");

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        category: expense.category.title,
        date: new Date(expense.date).toISOString().split("T")[0], // Format date for input
        paymentMethod: expense.paymentMethod.title,
        notes: expense.notes || "",
      });
    } else {
      // Reset form for adding new expense
      setFormData({
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "",
        notes: "",
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (
      !formData.amount ||
      !formData.category ||
      !formData.date ||
      !formData.paymentMethod
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const expenseToSave = { ...formData };
      if (expense && expense._id) {
        expenseToSave._id = expense._id; // Include ID for update
      }
      await onSave(expenseToSave);
      onClose();
    } catch (err) {
      setError("Failed to save expense.");
      console.error("Save expense error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createCategory(token, { name: newCategoryName });
      setNewCategoryName("");
      setIsCreatingCategory(false);
      await fetchCategoriesAndPaymentMethods(); // Refetch categories after creation
    } catch (err) {
      setError("Failed to create category.");
      console.error("Create category error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePaymentMethod = async () => {
    if (!newPaymentMethodName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createPaymentMethod(token, { name: newPaymentMethodName });
      setNewPaymentMethodName("");
      setIsCreatingPaymentMethod(false);
      await fetchCategoriesAndPaymentMethods(); // Refetch payment methods after creation
    } catch (err) {
      setError("Failed to create payment method.");
      console.error("Create payment method error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">
        {expense ? "Edit Expense" : "Add New Expense"}
      </h2>
      <form onSubmit={handleSave}>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Amount:
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Category:
          </label>
          <CategorySelect
            categories={categories}
            selectedCategory={formData.category}
            onSelectCategory={(value) =>
              setFormData({ ...formData, category: value })
            }
            onCreateNew={() => setIsCreatingCategory(true)}
          />
          {isCreatingCategory && (
            <div
              className="mt-2 flex // components/ExpenseEditModal.js (Continued)
                items-center"
            >
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                placeholder="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingCategory(false)}
                className="ml-2 text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Date:
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="paymentMethod"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Payment Method:
          </label>
          <PaymentMethodSelect
            paymentMethods={paymentMethods}
            selectedPaymentMethod={formData.paymentMethod}
            onSelectPaymentMethod={(value) =>
              setFormData({ ...formData, paymentMethod: value })
            }
            onCreateNew={() => setIsCreatingPaymentMethod(true)}
          />
          {isCreatingPaymentMethod && (
            <div className="mt-2 flex items-center">
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                placeholder="New Payment Method Name"
                value={newPaymentMethodName}
                onChange={(e) => setNewPaymentMethodName(e.target.value)}
              />
              <button
                type="button"
                onClick={handleCreatePaymentMethod}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingPaymentMethod(false)}
                className="ml-2 text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="notes"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Notes (Optional):
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// You will need to create a Modal component (e.g., components/Modal.js)
// Here's a basic example using Tailwind CSS for styling and React Portals for rendering outside the DOM tree.
