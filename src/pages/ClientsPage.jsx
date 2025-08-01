import React, { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useClients } from "../context/ClientContext";
import EditClientModal from "../components/clients/EditClientModal";
import ConfirmationDeleteModal from "../components/common/ConfirmationDeleteModal";
import ClientTable from "../components/dashboard/ClientTable";
import ClientForm from "../components/clients/ClientForm";
import { useNavigate } from "react-router-dom";

const ClientsPage = () => {
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Filtered search logic
  const filtered = search
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.mobile.toLowerCase().includes(search.toLowerCase())
      )
    : clients;

  // Handlers
  const handleAddClient = (client) => addClient(client);

  const handleEdit = (id) => {
    const client = clients.find((c) => c.id === id);
    setEditClient(client);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setPendingDeleteId(id);
    setConfirmDeleteOpen(true);
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
          <h1 className="text-2xl font-bold text-blue-900">Clients</h1>
        </div>
        {/* Advanced Search */}
        <div className="relative">
          <input
            className="border-[3px] rounded-lg py-2 px-3 pl-9 text-gray-500 text-sm border-gray-400 w-full focus:outline-none caret-blue-500"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>
      {/* Main grid: left (list) and right (form) */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Client list */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow p-4 flex-1">
            <ClientTable
              clients={filtered}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </div>
        </div>
        {/* Right: Add Client form */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2 text-blue-900">
              Add Client
            </h2>
            <ClientForm onSubmit={handleAddClient} />
          </div>
        </div>
      </div>
      {/* Edit Modal */}
      <EditClientModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        client={editClient}
        onSave={updateClient}
      />
      {/* Delete Confirmation Modal */}
      <ConfirmationDeleteModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={() => pendingDeleteId && deleteClient(pendingDeleteId)}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default ClientsPage;
