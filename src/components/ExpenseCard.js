import React from "react";

export default function ExpenseCard({ expense, onEditClick, onDeleteClick }) {
  return (
    <div className="bg-gradient-to-br from-[#eaf0ff] via-[#f7faff] to-[#dbeafe] p-6 rounded-2xl shadow-xl border border-[#3d65ff]/10 transition-transform hover:scale-[1.025] hover:shadow-2xl duration-200 min-w-[260px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-[#3d65ff] flex-1 truncate">
          {expense.category?.title || "No Category"}
        </h3>
        <span className="bg-[#3d65ff]/10 text-[#3d65ff] px-3 py-1 rounded-full text-sm font-semibold ml-2">
          ₹{expense.amount}
        </span>
      </div>
      <div className="flex flex-col gap-1 text-[#1e2a47] text-sm mb-2">
        <span className="flex items-center gap-2">
          <span className="font-medium">Date:</span>
          {expense.date ? new Date(expense.date).toLocaleDateString() : "N/A"}
        </span>
        <span className="flex items-center gap-2">
          <span className="font-medium">Payment:</span>
          {expense.paymentMethod?.title || "No Payment Method"}
        </span>
        {expense.note && (
          <span className="flex items-center gap-2">
            <span className="font-medium">Note:</span>
            <span className="italic text-[#3d65ff]/80">{expense.note}</span>
          </span>
        )}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => onEditClick(expense)}
          className="px-4 py-1 rounded-full bg-[#eaf0ff] text-[#3d65ff] border border-[#3d65ff]/40 font-semibold shadow hover:bg-[#3d65ff] hover:text-white hover:shadow-lg transition-colors duration-150"
        >
          Edit
        </button>
        <button
          onClick={() => onDeleteClick(expense._id)}
          className="px-4 py-1 rounded-full bg-[#fff0f0] text-[#e53e3e] border border-[#e53e3e]/30 font-semibold shadow hover:bg-[#e53e3e] hover:text-white hover:shadow-lg transition-colors duration-150"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
