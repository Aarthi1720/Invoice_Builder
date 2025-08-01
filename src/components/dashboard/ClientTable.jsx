import React, { useState, useEffect } from "react";
import { MoreHorizontal, UserCircle } from "lucide-react";
import EmptyListIcon from "../../assets/No Search Results.json";
import Lottie from "lottie-react";

const EmptySVG = () => (
  <div className="flex flex-col items-center justify-center pb-5">
    <Lottie animationData={EmptyListIcon} style={{ width: 200, height: 200 }} />
    <span className="text-gray-400">No clients</span>
  </div>
);

const ClientTable = ({ clients = [], onEdit, onDelete }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  // Click outside to close menu
  useEffect(() => {
    if (!openMenuId) return;
    function closeMenu(e) {
      if (
        !e.target.closest(".client-action-menu") &&
        !e.target.closest(".client-menu-btn")
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

  if (clients.length === 0)
    return (
      <div className="flex justify-center items-center">
        <EmptySVG />
      </div>
    );

  return (
    <div className="overflow-x-auto md:overflow-x-visible">
      {/* Desktop table */}
      <table className="min-w-[600px] w-full hidden md:table">
        <thead>
          <tr className="text-gray-600 text-sm xl:text-[17px]">
            <th className="px-4 py-2 text-left font-medium">Name</th>
            <th className="px-4 py-2 text-left font-medium">Mobile</th>
            <th className="px-4 py-2 text-left font-medium">Email</th>
            <th className="px-4 py-2 text-center font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              className="border-b-0 border-b-gray-600 last:border-none hover:bg-gray-50 transition"
            >
              <td className="px-4 py-2 flex items-center">
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-8 h-8 text-gray-300" />
                )}
                <span className="px-4 py-2 text-sm text-gray-500 font-medium">
                  {client.name}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-500">
                {client.mobile}
              </td>
              <td className="px-4 py-2 text-sm text-gray-500 break-all max-w-[160px]">
                {client.email}
              </td>
              <td className="px-4 py-2 text-center relative">
                <button
                  className="client-menu-btn p-2 rounded-full hover:bg-blue-100 bg-gray-100 cursor-pointer"
                  onClick={() =>
                    setOpenMenuId(openMenuId === client.id ? null : client.id)
                  }
                  aria-label="Menu"
                >
                  <MoreHorizontal className="w-5 h-5 text-blue-400" />
                </button>
                {openMenuId === client.id && (
                  <div className="client-action-menu absolute right-2 top-10 bg-gray-100 shadow-lg rounded z-30 w-32 text-gray-600 font-medium">
                    {onEdit && (
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-300 cursor-pointer"
                        onClick={() => {
                          onEdit(client.id);
                          setOpenMenuId(null);
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-300 cursor-pointer"
                        onClick={() => {
                          onDelete(client.id);
                          setOpenMenuId(null);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Mobile stacked version */}
      <div className="md:hidden">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-xl shadow p-2 mb-4 flex flex-col relative"
          >
            <div className="flex flex-col justify-between gap-2">
              {client.logo ? (
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="w-8 h-8 text-gray-300" />
              )}
              <div className="text-[13px] text-gray-500 flex justify-between">
                <p className="text-gray-700">Name</p>
                <p>{client.name}</p>
              </div>
              <div className="text-[13px] text-gray-500 flex justify-between">
                <p className="text-gray-700">Mobile</p>
                {client.mobile}
              </div>
              <div className="text-[13px] text-gray-500 flex justify-between">
                <p className="text-gray-700">Email</p>
                <p className="break-all max-w-[160px]">{client.email}</p>
              </div>
              <div className="text-[13px] text-gray-500 flex justify-between">
                <p className="text-gray-700">Action</p>
                <button
                  className="client-menu-btn p-2 ml-auto rounded-full hover:bg-blue-100 bg-gray-100 cursor-pointer"
                  onClick={() =>
                    setOpenMenuId(openMenuId === client.id ? null : client.id)
                  }
                  aria-label="Menu"
                >
                  <MoreHorizontal className="w-4 h-4 text-blue-400" />
                </button>
              </div>
              {openMenuId === client.id && (
                <div className="client-action-menu absolute right-2 top-16 bg-gray-100 shadow-lg rounded z-30 w-32 text-gray-600 medium">
                  {onEdit && (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 hover:cursor-pointer"
                      onClick={() => {
                        onEdit(client.id);
                        setOpenMenuId(null);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:cursor-pointer"
                      onClick={() => {
                        onDelete(client.id);
                        setOpenMenuId(null);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientTable;
