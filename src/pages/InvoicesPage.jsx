import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InvoiceTable from "../components/dashboard/InvoiceTable";
import { Plus, ArrowLeft, Search } from "lucide-react";
import { useInvoices } from "../context/InvoiceContext";
import ConfirmationDeleteModal from "../components/common/ConfirmationDeleteModal"; // Import modal
import { useRef } from "react";

const InvoicesPage = () => {
  const { invoices, deleteInvoice } = useInvoices();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const searchRef = useRef();

  // Filtered search
  const filtered = search
    ? invoices.filter(
        (i) =>
          (i.invoiceNo &&
            i.invoiceNo.toLowerCase().includes(search.toLowerCase())) ||
          (i.billingTo?.name &&
            i.billingTo.name.toLowerCase().includes(search.toLowerCase())) ||
          (i.status && i.status.toLowerCase().includes(search.toLowerCase()))
      )
    : invoices;

  // Delete handlers
  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteInvoice(deleteId);
    setDeleteId(null);
    setDeleteModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen p-4 flex flex-col">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-300 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-blue-900">Invoices</h1>
        </div>
        {/* Advanced Search */}
        <div className="flex flex-col items-center gap-2 lg:flex-row lg:justify-between">
          <div className="relative">
            <input
              className="border-[3px] rounded-lg py-2 px-3 pl-9 text-gray-500 text-sm border-gray-400 w-full focus:outline-none caret-blue-500"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              ref={searchRef}
              autoComplete="off"
            />
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <button
            className="w-full flex items-center gap-1 font-medium bg-gradient-to-br from-[#708ae9] to-[#5a4de8] text-white rounded-lg pl-4 py-2  transition hover:cursor-pointer hover:bg-gradient-to-tl hover:from-[#708ae9] hover:to-[#5a4de8] duration-500 active:scale-90 "
            onClick={() => navigate("/invoices/new")}
          >
            <Plus className="w-5 h-5" />
            Add New Invoice
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl shadow p-4 flex-1">
        <InvoiceTable
          invoices={filtered}
          onDelete={handleDelete} // Show modal
        />
      </div>

      {/* Delete Modal */}
      <ConfirmationDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default InvoicesPage;
