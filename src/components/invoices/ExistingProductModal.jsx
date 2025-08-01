import React, { useState, useEffect, useRef } from "react";
import { useProducts } from "../../context/ProductContext";
import { Search } from "lucide-react";

const ExistingProductModal = ({ open, onSelect, onClose }) => {
  const { products } = useProducts();
  const [search, setSearch] = useState("");
  const modalRef = useRef();

  // Close on background click
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Close on Esc key
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onMouseDown={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[95vw] max-w-2xl p-6 flex flex-col max-h-[80vh]"
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header & Search */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg md:text-2xl font-bold text-blue-900 ">
            Select Existing Product
          </h2>
          <div className="relative">
            <input
              className="border-[3px] rounded-lg py-2 px-3 pl-9 text-gray-500 text-sm border-gray-400 w-full focus:outline-none caret-blue-500"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
        {/* List/Table */}
        <div className="flex-1 overflow-y-auto">
          {/* Desktop table */}
          <table className="min-w-full hidden md:table">
            <thead>
              <tr className="text-xs text-gray-600 md:text-[16px]">
                <th className="px-3 py-2 text-left">Product ID</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-center">Amount</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-400 text-gray-500 hover:bg-gray-100"
                  >
                    <td className="px-3 py-2">{p.id}</td>
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2 text-center font-bold">
                      ₹{p.amount?.toLocaleString() || 0}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        className="px-3 py-1 bg-gradient-to-br from-[#708ae9] to-[#5a4de8] text-white font-semibold rounded-xl transition hover:cursor-pointer hover:bg-gradient-to-tl hover:from-[#708ae9] hover:to-[#5a4de8] duration-500 active:scale-90"
                        onClick={() => onSelect(p)}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-8">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Mobile: Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {filtered.length ? (
              filtered.map((p) => (
                <div
                  key={p.id}
                  className="bg-gray-50 rounded-lg flex flex-col gap-3 px-3 py-2"
                >
                  <div className="flex  flex-col justify-between gap-2 text-gray-500">
                    <div className=" flex justify-between">
                      <span>ID</span>
                      {p.id}
                    </div>
                    <div className="flex justify-between">
                      <span>Name:</span>
                      {p.name}
                    </div>
                    <div className="flex justify-between">
                      <p>Amount</p>₹{p.amount?.toLocaleString() || 0}
                    </div>
                  </div>
                  <button
                    className="px-3 py-1 bg-gradient-to-br from-[#708ae9] to-[#5a4de8] text-white font-semibold rounded-xl transition hover:cursor-pointer hover:bg-gradient-to-tl hover:from-[#708ae9] hover:to-[#5a4de8] duration-500 active:scale-90"
                    onClick={() => onSelect(p)}
                  >
                    Select
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                No products found
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:cursor-pointer hover:bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExistingProductModal;
