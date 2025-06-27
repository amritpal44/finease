// components/ExpenseCard.js
import React from "react";

export default function ExpenseCard({ expense, onEditClick, onDeleteClick }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold">{expense.category}</h3>
      <p>Amount: ₹{expense.amount}</p>
      <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
      <p>Payment Method: {expense.paymentMethod}</p>
      {expense.notes && <p>Notes: {expense.notes}</p>}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onEditClick(expense)}
          className="text-blue-500 hover:text-blue-700 mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => onDeleteClick(expense._id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
