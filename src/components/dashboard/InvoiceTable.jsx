import React, { useState, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyListIcon from "../../assets/No Search Results.json";
import Lottie from "lottie-react";

const EmptySVG = () => (
  <div className="flex flex-col items-center justify-center pb-5">
    <Lottie animationData={EmptyListIcon} style={{ width: 200, height: 200 }} />
    <span className="text-gray-400">No invoices</span>
  </div>
);

const statusColor = {
  paid: "bg-green-100 text-green-600",
  unpaid: "bg-red-100 text-red-600",
  draft: "bg-yellow-100 text-yellow-600",
};

const InvoiceTable = ({ invoices = [], onDelete, onDetail }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();

  // Close menu on outside click/tap
  useEffect(() => {
    if (!openMenuId) return;
    function closeMenu(e) {
      if (
        !e.target.closest(".invoice-action-menu") &&
        !e.target.closest(".invoice-menu-btn")
      ) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("touchstart", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("touchstart", closeMenu);
    };
  }, [openMenuId]);

  if (invoices.length === 0)
    return (
      <div className="flex justify-center items-center">
        <EmptySVG />
      </div>
    );

  // --- Desktop Table
  return (
    <div className="overflow-x-auto md:overflow-x-visible">
      <table className="min-w-[600px] w-full hidden md:table">
        <thead>
          <tr className="text-gray-600 text-sm xl:text-[17px]">
            <th className="px-4 py-2 text-left font-medium">Invoice Name</th>
            <th className="px-4 py-2 text-left font-medium">Client Name</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-right font-medium">Amount</th>
            <th className="px-4 py-2 text-center font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr
              key={inv.id}
              className="border-b-0 border-b-gray-600 last:border-none hover:bg-gray-50 transition"
            >
              <td className="px-4 py-2 text-sm text-gray-500 font-medium">
                {inv.invoiceName || inv.invoiceNo || "--"}
              </td>
              <td className="px-4 py-2 text-sm text-gray-500">
                {inv.clientName || inv.billingTo?.name || "--"}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                    statusColor[inv.status] || "bg-gray-100 text-gray-500"
                  }`}
                >
                  {inv.status}
                </span>
              </td>
              <td
                className={`px-4 py-2 text-right font-bold ${
                  inv.status === "draft" && "text-gray-500"
                } ${inv.status === "unpaid" && "text-red-600"} ${
                  inv.status === "paid" && "text-green-600"
                }`}
              >
                ₹
                {inv.amount?.toLocaleString() ||
                  inv.total?.toLocaleString() ||
                  0}
              </td>
              <td className="px-4 py-2 text-center relative">
                <button
                  className=" p-2 rounded-full hover:bg-blue-100 bg-gray-100 cursor-pointer"
                  onClick={() =>
                    setOpenMenuId(openMenuId === inv.id ? null : inv.id)
                  }
                  aria-label="Open menu"
                >
                  <MoreHorizontal className="w-5 h-5 text-blue-400" />
                </button>
                {openMenuId === inv.id && (
                  <div className="invoice-action-menu absolute right-2 top-16 bg-gray-100 shadow-lg rounded z-30 w-32 text-gray-500 font-medium">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-300 cursor-pointer"
                      onClick={() => {
                        if (onDetail) onDetail(inv.id);
                        else navigate(`/invoices/${inv.id}`);
                        setOpenMenuId(null);
                      }}
                    >
                      Details
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-300 cursor-pointer"
                      onClick={() => {
                        onDelete(inv.id);
                        setOpenMenuId(null);
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

      {/* Mobile Stacked version */}
      <div className="md:hidden">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="bg-white rounded-xl shadow p-2 mb-4 flex flex-col relative text-sm"
          >
            <div className="flex flex-col justify-between gap-2">
              <div className="text-[13px] text-gray-500 flex justify-between items-center">
                <p className="text-gray-700">Invoice Name</p>
                <p>{inv.invoiceName || inv.invoiceNo || "--"}</p>
              </div>
              <div className="text-[13px] text-gray-500 flex justify-between">
                <p className="text-gray-700">Client Name</p>
                {inv.clientName || inv.billingTo?.name || "--"}
              </div>
              <div className="text-[13px] text-gray-500 flex justify-between">
                <p className="text-gray-700">Status</p>
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold capitalize ${
                    statusColor[inv.status] || "bg-gray-100 text-gray-500"
                  }`}
                >
                  {inv.status}
                </span>
              </div>
              <div className="text-[13px] text-gray-500 flex justify-between">
                <p className="text-gray-700">Amount</p>
                <span
                  className={`text-right font-bold ${
                    inv.status === "draft" && "text-gray-500"
                  } ${inv.status === "unpaid" && "text-red-600"} ${
                    inv.status === "paid" && "text-green-600"
                  }`}
                >
                  ₹
                  {inv.amount?.toLocaleString() ||
                    inv.total?.toLocaleString() ||
                    0}
                </span>
              </div>
              <div className="text-[13px] flex justify-between">
                <p className="text-gray-700">Action</p>
                <button
                  className="invoice-menu-btn rounded-3xl p-1 hover:bg-blue-100 bg-gray-100 cursor-pointer"
                  onClick={() =>
                    setOpenMenuId(openMenuId === inv.id ? null : inv.id)
                  }
                  aria-label="Open menu"
                >
                  <MoreHorizontal className="w-4 h-4 text-blue-400" />
                </button>
              </div>
              {openMenuId === inv.id && (
                <div className="invoice-action-menu absolute right-2 top-16 bg-gray-100 shadow-lg rounded z-30 w-32 text-gray-500 font-medium">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => {
                      if (onDetail) onDetail(inv.id);
                      else navigate(`/invoices/${inv.id}`);
                      setOpenMenuId(null);
                    }}
                  >
                    Details
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => {
                      onDelete(inv.id);
                      setOpenMenuId(null);
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

export default InvoiceTable;
