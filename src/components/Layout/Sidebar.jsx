import React from "react";
import { NavLink } from "react-router-dom";
import { FileText, Home, Users, Package, UserCircle, X } from "lucide-react";
import { useCompany } from "../../context/CompanyContext";
import LottieInvoice from "../../assets/pay invoice blue.json";
import Lottie from "lottie-react";

const navLinks = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <Home className="w-6 h-6 mr-2" />,
  },
  {
    name: "Invoices",
    path: "/invoices",
    icon: <FileText className="w-6 h-6 mr-2" />,
  },
  {
    name: "Clients",
    path: "/clients",
    icon: <Users className="w-6 h-6 mr-2" />,
  },
  {
    name: "Products",
    path: "/products",
    icon: <Package className="w-6 h-6 mr-2" />,
  },
];

const Sidebar = ({ open, onClose }) => {
  const { company } = useCompany();

  return (
    <>
      {/* Overlay: only on mobile when open */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 md:hidden transition-opacity duration-200 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar drawer for mobile, static on desktop */}
      <aside
        className={`
          fixed z-50 top-0 left-0 h-full w-72 bg-white shadow-2xl transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:shadow-none md:block
        `}
      >
        {/* Close button: mobile only */}
        <div className="md:hidden flex justify-end p-2">
          <button onClick={onClose} aria-label="Close sidebar">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        {/* Logo & App Name */}
        <div className="flex justify-center items-center w-72 -ml-5">
          <Lottie
            animationData={LottieInvoice}
            loop={true}
            style={{ width: 100, height: 100, marginTop: -20, marginLeft: -10 }}
          />
          <span className="text-2xl font-bold text-blue-800 font-Lora">
            Invoice Builder
          </span>
        </div>

        {/* Business Info */}
        <div className="px-4 pb-4 ">
          <div className="flex items-center gap-2 mb-2 bg-gray-50 rounded-md p-1">
            {company.logo ? (
              <img
                src={company.logo}
                alt="company"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-8 h-8 text-gray-300" />
            )}
            {company.name ? (
              <span className="font-semibold text-gray-500 truncate">
                {company.name}
              </span>
            ) : (
              <span className="font-semibold text-gray-500 truncate font-Lora">
                Your Business
              </span>
            )}
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col gap-5 px-2">
          {navLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition font-Playfair font-medium focus:outline-none focus:border-none  ${
                  isActive
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
