import React from "react";

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Do you really want to delete this?",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirmColor = "bg-gradient-to-br from-[#e27d7d] to-[#e41111] text-white rounded-xl hover:bg-gradient-to-tl transition hover:cursor-pointer hover:from-[#e27d7d] hover:to-[#e41111] duration-500 active:scale-90",
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-2">
        <h2 className="text-xl font-bold mb-2 text-gray-700">{title}</h2>
        <div className="text-gray-600 mb-4">{message}</div>
        <div className="flex gap-3 mt-6 font-semibold">
          <button
            className="flex-1 bg-gray-200 rounded-xl py-2 text-gray-700 cursor-pointer hover:bg-gray-300"
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button
            className={`flex-1 rounded-xl py-2 ${confirmColor}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
