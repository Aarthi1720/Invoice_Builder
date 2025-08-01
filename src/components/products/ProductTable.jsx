import React, { useState, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyListIcon from "../../assets/No Search Results.json";
import Lottie from "lottie-react";

const EmptySVG = () => (
  <div className="flex flex-col items-center justify-center pb-5">
    <Lottie animationData={EmptyListIcon} style={{ width: 200, height: 200 }} />
    <span className="text-gray-400">No products</span>
  </div>
);

const ProductTable = ({ products = [], onEdit, onDelete }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (openMenuId === null) return;
    function closeMenu(e) {
      // Check for menu-btn-<id> or menu-div-<id> anywhere in composed path
      const path = e.composedPath ? e.composedPath() : [];
      let found = false;
      path.forEach((el) => {
        if (el?.classList?.contains?.(`menu-btn-${openMenuId}`)) found = true;
        if (el?.classList?.contains?.(`menu-div-${openMenuId}`)) found = true;
      });
      if (!found) setOpenMenuId(null);
    }
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("touchstart", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("touchstart", closeMenu);
    };
  }, [openMenuId]);

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <EmptySVG />
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="overflow-x-auto md:overflow-x-visible">
        <table className="min-w-[600px] w-full hidden md:table">
          <thead>
            <tr className="text-gray-600 text-sm xl:text-[17px]">
              <th className="px-4 py-2 text-left font-medium">Product ID</th>
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="px-4 py-2 text-center font-medium">Amount</th>
              <th className="px-4 py-2 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b-0 border-b-gray-600 last:border-none hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2 text-sm text-gray-500 font-medium">
                  {p.id}
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">{p.name}</td>
                <td className="px-4 py-2 text-center font-bold text-gray-500">
                  ₹{p.amount?.toLocaleString() || 0}
                </td>

                <td className="px-4 py-2 text-center relative">
                  <button
                    className={`menu-btn menu-btn-${p.id} p-2 rounded-full hover:bg-blue-100 bg-gray-100 cursor-pointer`}
                    onClick={() =>
                      setOpenMenuId(openMenuId === p.id ? null : p.id)
                    }
                  >
                    <MoreHorizontal className="w-5 h-5 text-blue-400" />
                  </button>
                  {openMenuId === p.id && (
                    <div
                      className={`product-action-menu menu-div-${p.id} absolute right-2 top-10 bg-gray-100 shadow-lg rounded z-30 w-32 text-gray-600 font-medium`}
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-gray-300"
                        onClick={() => {
                          setOpenMenuId(null);
                          onEdit(p.id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 cursor-pointer hover:bg-gray-300"
                        onClick={() => {
                          setOpenMenuId(null);
                          onDelete(p.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow p-4 mb-4 flex flex-col gap-2 relative"
          >
            <div className="flex flex-col justify-between gap-2">
              <div className="text-sm text-gray-500 flex justify-between items-center">
                <p className="text-gray-700">Product Id</p>
                {p.id}
              </div>
              <div className="text-sm text-gray-500 flex justify-between">
                <p className="text-gray-700">Name</p>
                {p.name}
              </div>
              <div className="text-sm text-gray-500 flex justify-between">
                <p className="text-gray-700">Amount</p>
                <p className="font-bold text-right">
                  ₹{p.amount?.toLocaleString() || 0}
                </p>
              </div>
              <div className="text-sm flex justify-between">
                <p className="text-gray-700">Action</p>
                <button
                  className={`menu-btn menu-btn-${p.id} rounded-3xl p-1 hover:bg-blue-100 bg-gray-100 cursor-pointer`}
                  onClick={() =>
                    setOpenMenuId(openMenuId === p.id ? null : p.id)
                  }
                >
                  <MoreHorizontal className="w-4 h-4 text-blue-400" />
                </button>
              </div>
              {openMenuId === p.id && (
                <div
                  className={`product-action-menu menu-div-${p.id} absolute right-4 top-16 bg-gray-100 shadow-lg rounded z-30 w-32 text-gray-600 font-medium`}
                >
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => {
                      setOpenMenuId(null);
                      onEdit(p.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => {
                      setOpenMenuId(null);
                      onDelete(p.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;
