import React from "react";

const ConfirmationModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[90vw] max-w-md text-center">
        <div className="mb-4">
          <div className="text-xl md:text-2xl font-bold text-[#069348] mb-2">
            Invoice Confirmation
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">
              Only "Draft Save" can be modified. If "Unpaid" or "Paid" invoice
              can't be modified.
            </span>
          </div>
        </div>
        <div className="flex gap-4 justify-center mt-6">
          <button
            className="flex-1 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-xl py-2 font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2 font-medium cursor-pointer"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
