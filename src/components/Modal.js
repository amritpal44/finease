// components/Modal.js
import React from "react";
import ReactDOM from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      onClick={onClose}
    >
      <div
        className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="mt-3 text-center">
          {children}
          <div className="mt-4">
            {/* You can add a close button here if needed */}
          </div>
        </div>
      </div>
    </div>,
    document.body // Render the modal outside the main app div
  );
}
