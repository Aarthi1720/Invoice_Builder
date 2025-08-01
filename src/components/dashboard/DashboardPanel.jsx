import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryCards from "./SummaryCards";
import InvoiceTable from "./InvoiceTable";
import ClientTable from "./ClientTable";
import ClientForm from "../clients/ClientForm";
import EditClientModal from "../clients/EditClientModal";
import ConfirmationDeleteModal from "../common/ConfirmationDeleteModal";
import { useInvoices } from "../../context/InvoiceContext";
import { useClients } from "../../context/ClientContext";
import { useCompany } from "../../context/CompanyContext";
import BusinessInfoForm from "../business/BusinessInfoForm";

const DashboardPanel = () => {
  const navigate = useNavigate();
  const { invoices, deleteInvoice } = useInvoices();
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const { company, updateCompany, clearCompany } = useCompany();

  if (invoices === null || clients === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  // Dashboard summary
  const paidOrUnpaidInvoices = invoices.filter((i) => i.status !== "draft");
  const totalAmount = paidOrUnpaidInvoices.reduce(
    (sum, inv) => sum + Number(inv.amount || 0),
    0
  );

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalUnpaid = invoices
    .filter((i) => i.status === "unpaid")
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  // Delete/Modal state
  const [deleteInvoiceModalOpen, setDeleteInvoiceModalOpen] = useState(false);
  const [pendingInvoiceId, setPendingInvoiceId] = useState(null);
  const [deleteClientModalOpen, setDeleteClientModalOpen] = useState(false);
  const [pendingClientId, setPendingClientId] = useState(null);

  // Client edit modal
  const [editClientModalOpen, setEditClientModalOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);

  // Actions
  const handleInvoiceDelete = (id) => {
    setPendingInvoiceId(id);
    setDeleteInvoiceModalOpen(true);
  };
  const handleClientDelete = (id) => {
    setPendingClientId(id);
    setDeleteClientModalOpen(true);
  };
  const handleClientEdit = (id) => {
    const client = clients.find((c) => c.id === id);
    setEditClient(client);
    setEditClientModalOpen(true);
  };

  const handleBusinessInfoUpdate = (info) => {
    updateCompany(info);
    console.log("saved");
  };
  const handleAddClient = (client) => addClient(client);
  const handleEditClientSave = (id, data) => {
    updateClient(id, data);
    setEditClientModalOpen(false);
    setEditClient(null);
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800 text-center md:text-left font-Playfair">
        Dashboard
      </h1>
      <div className="flex flex-1 gap-6 flex-col lg:flex-row">
        <div className="flex-1 flex flex-col gap-5">
          <SummaryCards
            totalAmount={totalAmount}
            totalPaid={totalPaid}
            totalUnpaid={totalUnpaid}
          />
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-blue-900 ml-4">
                Invoices
              </h2>
            </div>
            <InvoiceTable invoices={invoices} onDelete={handleInvoiceDelete} />
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-blue-900">Clients</h2>
            </div>
            <ClientTable
              clients={clients}
              onEdit={handleClientEdit}
              onDelete={handleClientDelete}
            />
          </div>
        </div>
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <button
            className="w-full bg-gradient-to-br from-[#708ae9] to-[#5a4de8] text-white rounded-xl py-3 transition hover:cursor-pointer hover:bg-gradient-to-tl hover:from-[#708ae9] hover:to-[#5a4de8] duration-500 active:scale-90"
            onClick={() => navigate("/invoices/new")}
          >
            + Add Invoice
          </button>
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2 text-blue-900">
              Business Info
            </h2>
            <BusinessInfoForm
              initial={company}
              onSubmit={handleBusinessInfoUpdate}
              clearCompany={clearCompany}
            />
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2 text-blue-900">
              Quick Add Client
            </h2>
            <ClientForm onSubmit={handleAddClient} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditClientModal
        open={editClientModalOpen}
        onClose={() => {
          setEditClientModalOpen(false);
          setEditClient(null);
        }}
        client={editClient}
        onSave={handleEditClientSave}
      />
      <ConfirmationDeleteModal
        open={deleteInvoiceModalOpen}
        onClose={() => setDeleteInvoiceModalOpen(false)}
        onConfirm={() => {
          if (pendingInvoiceId) deleteInvoice(pendingInvoiceId);
          setDeleteInvoiceModalOpen(false);
          setPendingInvoiceId(null);
        }}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
      <ConfirmationDeleteModal
        open={deleteClientModalOpen}
        onClose={() => setDeleteClientModalOpen(false)}
        onConfirm={() => {
          if (pendingClientId) deleteClient(pendingClientId);
          setDeleteClientModalOpen(false);
          setPendingClientId(null);
        }}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default DashboardPanel;
