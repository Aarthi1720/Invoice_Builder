import React, { useState, useEffect } from "react";

const EditProductModal = ({ open, onClose, product, onSave }) => {
  const [id, setId] = useState(product?.id || "");
  const [name, setName] = useState(product?.name || "");
  const [amount, setAmount] = useState(product?.amount || "");

  useEffect(() => {
    setId(product?.id || "");
    setName(product?.name || "");
    setAmount(product?.amount || "");
  }, [product]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id || !name || !amount) return;
    onSave(product.id, { id, name, amount: Number(amount) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-2">
        <h2 className="text-2xl font-bold text-blue-900 flex-1 mb-4">
          Edit Product
        </h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
            placeholder="Product ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <input
            type="text"
            className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
            placeholder="Product Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={0}
            required
          />
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              className="flex-1 bg-gray-200 rounded-xl py-2 hover:cursor-pointer font-medium hover:bg-gray-400 transition duration-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-br from-[#708ae9] to-[#5a4de8] text-white font-medium rounded-xl py-2 transition hover:cursor-pointer hover:bg-gradient-to-tl hover:from-[#708ae9] hover:to-[#5a4de8] duration-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
