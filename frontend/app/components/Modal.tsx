"use client";

import React, { useEffect } from "react";

interface ModalProps {
  title: string; // Title of the modal
  isOpen: boolean; // Control modal visibility
  onClose: () => void; // Close modal function
  children: React.ReactNode; // Modal content
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  useEffect(() => {
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null; // Don't render modal if not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
