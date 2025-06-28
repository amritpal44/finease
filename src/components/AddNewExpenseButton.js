// components/AddNewExpenseButton.js
import React from "react";

export default function AddNewExpenseButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 bg-[#3d65ff] hover:bg-[#2746b6] text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-150 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d65ff]/40 cursor-pointer"
    >
      <span className="text-lg font-bold">+</span>
      <span>Add New Expense</span>
    </button>
  );
}
