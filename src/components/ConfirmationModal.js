// components/ConfirmationModal.js
import React from "react";
import Modal from "./Modal"; // Use the same Modal component

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdropClassName="fixed inset-0 z-40 flex items-center justify-center bg-white/10 backdrop-blur-[6px]"
    >
      <div className="w-full max-w-md bg-white border border-[#3d65ff]/20 shadow-2xl px-8 py-6 rounded-lg mx-auto">
        <h3 className="text-xl font-bold mb-6 text-[#3d65ff] text-center tracking-tight">
          {message}
        </h3>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-[#1e2a47] font-semibold px-5 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d65ff]/20 transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#e53e3e] hover:bg-[#c53030] cursor-pointer text-white font-semibold px-5 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#e53e3e]/30 transition-all duration-150"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}
