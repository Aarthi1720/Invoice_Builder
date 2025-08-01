import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceNewPage from "./pages/InvoiceNewPage";
import InvoiceDetailPage from "./pages/InvoiceDetailPage";
import ClientsPage from "./pages/ClientsPage";
import ProductsPage from "./pages/ProductsPage";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Layout/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Menu } from "lucide-react";
import { useInvoices } from "./context/InvoiceContext";
import { useClients } from "./context/ClientContext";
import { useCompany } from "./context/CompanyContext";
import SplashScreen from "./pages/SplashScreen";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { invoices } = useInvoices();
  const { clients } = useClients();
  const { company } = useCompany();

  // Splash screen state (show for 5s on initial load)
  const [showSplash, setShowSplash] = useState(true);

  // Hide splash after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    // Show splash full screen (nothing else!)
    return <SplashScreen />;
  }

  // Wait until all required contexts are loaded
  if (invoices === null || clients === null || !company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Hamburger: visible only on mobile */}
        <button
          className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white shadow ${
            sidebarOpen ? "hidden" : "block"
          }`}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 text-blue-400" />
        </button>
        {/* Main Content */}
        <div className="flex-1 bg-gray-50 mt-16 rounded-md">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/invoices/new" element={<InvoiceNewPage />} />
            <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={800}
        closeOnClick={false}
      />
    </BrowserRouter>
  );
}

export default App;
