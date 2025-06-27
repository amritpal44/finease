// components/AddNewExpenseButton.js
import React from "react";

export default function AddNewExpenseButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      + Add New Expense
    </button>
  );
}
