import React, { useState } from "react";
import { useClients } from "../../context/ClientContext";
import { Search, User } from "lucide-react";

const ExistingClientModal = ({ open, onSelect, onClose }) => {
  const { clients } = useClients();
  const [search, setSearch] = useState("");

  const filtered = search
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.mobile.toLowerCase().includes(search.toLowerCase())
      )
    : clients;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-2xl p-6 flex flex-col max-h-[80vh]">
        {/* Header & Search */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg md:text-2xl font-bold text-blue-900">
            Select Existing Client
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
        {/* Desktop table */}
        <div className="flex-1 overflow-y-auto">
          <table className="min-w-full hidden md:table">
            <thead>
              <tr className="text-xs text-gray-600 md:text-[16px]">
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Mobile</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-400 text-gray-500 hover:bg-gray-100"
                  >
                    <td className="px-3 py-2 flex items-center gap-1">
                      {c.logo ? (
                        <img
                          src={c.logo || "/assets/logos/user-placeholder.png"}
                          alt={c.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-500" />
                      )}
                      <p>{c.name}</p>
                    </td>
                    <td className="px-3 py-2 text-left">{c.mobile}</td>
                    <td className="px-3 py-2 text-left break-all whitespace-normal max-w-[150px]">
                      {c.email}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        className="px-3 py-1 bg-gradient-to-br from-[#708ae9] to-[#5a4de8] text-white font-semibold rounded-xl transition hover:cursor-pointer hover:bg-gradient-to-tl hover:from-[#708ae9] hover:to-[#5a4de8] duration-500 active:scale-90"
                        onClick={() => onSelect(c)}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-8">
                    No clients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Mobile: Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {filtered.length ? (
              filtered.map((c) => (
                <div
                  key={c.id}
                  className="bg-gray-50 rounded-lg flex flex-col gap-3 px-3 py-2"
                >
                  {c.logo ? (
                    <img
                      src={c.logo || "/assets/logos/user-placeholder.png"}
                      alt={c.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-500" />
                  )}
                  <div className="flex  flex-col justify-between gap-2 text-gray-500">
                    <div className=" flex justify-between">
                      <p>Name:</p>
                      {c.name}
                    </div>
                    <div className=" flex justify-between">
                      <p>Email:</p>
                      <p className="break-all whitespace-normal max-w-[150px]">
                        {c.email}
                      </p>
                    </div>
                    <div className=" flex justify-between">
                      <p>Mobile:</p>
                      {c.mobile}
                    </div>
                  </div>
                  <button
                    className="px-3 py-1 bg-gradient-to-br from-[#708ae9] to-[#5a4de8] text-white font-semibold rounded-xl transition hover:cursor-pointer hover:bg-gradient-to-tl hover:from-[#708ae9] hover:to-[#5a4de8] duration-500 active:scale-90"
                    onClick={() => onSelect(c)}
                  >
                    Select
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                No clients found
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

export default ExistingClientModal;
