import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Pencil,
  FileDown,
  CheckCircle,
  BadgeDollarSign,
  Verified,
} from "lucide-react";
import BillingToForm from "../components/invoices/BillingToForm";
import InvoiceDetailsForm from "../components/invoices/InvoiceDetailsForm";
import TotalsSection from "../components/invoices/TotalsSection";
import ConfirmationModal from "../components/common/ConfirmationModal";
import ExistingClientModal from "../components/invoices/ExistingClientModal";
import ExistingProductModal from "../components/invoices/ExistingProductModal";
import { useInvoices } from "../context/InvoiceContext";
import { useCompany } from "../context/CompanyContext";
import ProductTableSection from "../components/invoices/ProductTableSection";
import { toast } from "react-toastify";
import ExportPDFModal from "../components/invoices/ExportPDFModal";

const InvoiceNewPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState(false);
  const { addInvoice } = useInvoices();
  const { company } = useCompany();

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: "",
    creationDate: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    currency: "INR",
  });

  const [taxes, setTaxes] = useState([{ name: "", percent: "" }]);
  const [fees, setFees] = useState([{ name: "", amount: "" }]);
  const [billingTo, setBillingTo] = useState({});
  const [showExistingClient, setShowExistingClient] = useState(false);

  const [showExistingProduct, setShowExistingProduct] = useState(false);
  const [products, setProducts] = useState([]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [saveType, setSaveType] = useState("Draft");
  const [showExportModal, setShowExportModal] = useState(false);

  // Calculate subtotal, tax, fees, total
  const subtotal =
    products.reduce(
      (sum, p) => sum + (Number(p.price) || 0) * (Number(p.qty) || 0),
      0
    ) || 0;
  const totalTax =
    taxes.reduce(
      (sum, t) => sum + (subtotal * (Number(t.percent) || 0)) / 100,
      0
    ) || 0;
  const totalFees =
    fees.reduce((sum, f) => sum + (Number(f.amount) || 0), 0) || 0;
  const grandTotal = subtotal + totalTax + totalFees;

  // Always provide a valid array for products
  const validProducts = Array.isArray(products) ? products : [];

  // Save invoice
  const handleSaveInvoice = (status) => {
    const newInvoice = {
      billingTo,
      products: validProducts,
      taxes: Array.isArray(taxes) ? taxes : [],
      fees: Array.isArray(fees) ? fees : [],
      invoiceNo: invoiceDetails.invoiceNo,
      creationDate: invoiceDetails.creationDate,
      dueDate: invoiceDetails.dueDate,
      currency: invoiceDetails.currency,
      status, // "draft" | "unpaid" | "paid"
      amount: grandTotal,
      company,
    };
    addInvoice(newInvoice);
    toast.success("Invoice added successfully👍");
    navigate("/invoices");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-2">
      {/* Centered and responsive container */}
      <div className="w-full max-w-[430px] md:max-w-3xl lg:max-w-7xl bg-white rounded-2xl shadow-md p-2 md:p-6 mb-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-300 cursor-pointer"
              onClick={() => navigate("/invoices")}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-blue-900 flex-1">
              New Invoice
            </h1>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:justify-end md:gap-2">
            {/* View/Edit toggle */}
            <button
              className="px-3 py-2 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 md:h-16 lg:h-12 focus:outline-none focus:border-none"
              onClick={() => setViewMode((v) => !v)}
            >
              {viewMode ? (
                <Pencil className="w-4 h-4 inline" />
              ) : (
                <Eye className="w-4 h-4 inline" />
              )}
              <span className="ml-1">
                {viewMode ? "Editing Mode" : "View Mode"}
              </span>
            </button>
            {/* Export PDF */}
            <button
              className="px-3 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 md:h-16 lg:h-12 focus:outline-none focus:border-none"
              onClick={() => setShowExportModal(true)}
            >
              <FileDown className="w-5 h-5 inline-block" />
              <span className="ml-1">Export PDF</span>
            </button>
          </div>
        </div>

        {/* Banner */}
        <div className="w-full h-48 md:h-48 rounded-2xl overflow-hidden mb-6 relative">
          <img
            src="/bgImage.jpg"
            alt="background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
          {/* Company Logo */}
          {company?.logo && (
            <img
              src={company.logo}
              alt="Logo"
              className="absolute left-6 top-6 w-16 h-16 object-cover rounded-full bg-white/70 p-1 shadow md:top-16"
              style={{ zIndex: 20 }}
            />
          )}
          {/* Company Details */}
          <div className="absolute left-28 top-8 z-10 text-white md:top-1/2 md:-translate-y-1/2 md:-translate-x-5/6 md:left-1/2 lg:left-1/3 xl:left-1/5">
            <div className="font-bold text-lg">
              {company?.name || "[Your Company Name]"}
            </div>
            <div className="text-xs">{company?.address || "[Address]"}</div>
            <div className="text-xs">{company?.email || "[Email]"}</div>
            <div className="text-xs">{company?.phone || "[Phone]"}</div>
          </div>
          {/* Invoice Label (Right bottom) */}
          <div className="absolute left-28 bottom-5 text-white text-4xl font-bold drop-shadow lg:text-5xl xl:text-6xl  md:top-1/2 md:-translate-y-2/12 md:translate-x-1/2 md:left-1/2 lg:left-3/5 xl:left-3/5">
            Invoice
          </div>
        </div>

        {/* Forms section: stack on mobile, side by side on md+ */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mb-6">
          <div className="w-full">
            <BillingToForm
              value={billingTo}
              onChange={setBillingTo}
              onExistingClick={() => setShowExistingClient(true)}
              readOnly={viewMode}
            />
          </div>
          <div className="w-full">
            <InvoiceDetailsForm
              value={invoiceDetails}
              onChange={setInvoiceDetails}
              readOnly={viewMode}
            />
          </div>
        </div>

        {/* Product Table */}
        <div className="mb-6">
          <ProductTableSection
            products={products}
            onChange={setProducts}
            onAddExisting={() => setShowExistingProduct(true)}
            readOnly={viewMode}
          />
          {!viewMode && (
            <div className="flex justify-end items-end mt-2">
              <button
                className="px-3 py-2 text-sm rounded-md bg-green-100 hover:bg-green-200 text-green-700"
                onClick={() => setShowExistingProduct(true)}
              >
                + Add Existing Product
              </button>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="mb-6">
          <TotalsSection
            subtotal={subtotal}
            taxes={taxes}
            fees={fees}
            grandTotal={grandTotal}
            onTaxesChange={setTaxes}
            onFeesChange={setFees}
            readOnly={viewMode}
          />
        </div>

        {/* Action buttons */}
        {!viewMode && (
          <div className="flex flex-col gap-4 md:flex-row md:justify-around mb-4">
            <button
              className="flex-1 bg-gray-200 hover:bg-gray-300 rounded-xl px-4 py-3 font-medium flex items-center justify-center"
              onClick={() => {
                setSaveType("Draft");
                setShowConfirmModal(true);
              }}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Save as Draft
            </button>
            <button
              className="flex-1 border hover:bg-red-50 border-red-400 rounded-xl px-4 py-3 font-medium text-red-600 flex items-center justify-center"
              onClick={() => {
                setSaveType("Unpaid");
                setShowConfirmModal(true);
              }}
            >
              <BadgeDollarSign className="w-5 h-5 mr-2" />
              Save as Unpaid
            </button>
            <button
              className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl px-4 py-3 font-medium text-white flex items-center justify-center"
              onClick={() => {
                setSaveType("Paid");
                setShowConfirmModal(true);
              }}
            >
              <Verified className="w-5 h-5 mr-2" />
              Save as Paid
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmationModal
          open={showConfirmModal}
          actionLabel={saveType}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            handleSaveInvoice(saveType.toLowerCase());
            setShowConfirmModal(false);
          }}
        />
      )}

      {/* PDF Export Modal */}
      {showExportModal && (
        <ExportPDFModal
          open={showExportModal}
          onClose={() => setShowExportModal(false)}
          invoiceData={{
            billingTo,
            products: validProducts,
            taxes,
            fees,
            ...invoiceDetails,
            amount: grandTotal,
            company,
          }}
        />
      )}

      {/* Existing Client Modal */}
      {showExistingClient && (
        <ExistingClientModal
          open={showExistingClient}
          onSelect={(client) => {
            setBillingTo(client);
            setShowExistingClient(false);
          }}
          onClose={() => setShowExistingClient(false)}
        />
      )}

      {/* Existing Product Modal */}
      {showExistingProduct && (
        <ExistingProductModal
          open={showExistingProduct}
          onSelect={(product) => {
            setProducts((prev) => {
              // Find first empty row (no description, price, qty)
              const emptyIdx = prev.findIndex(
                (p) => !p.description && !p.price && !p.qty
              );
              if (emptyIdx !== -1) {
                const arr = [...prev];
                arr[emptyIdx] = {
                  ...arr[emptyIdx],
                  description: product.name,
                  price: product.amount,
                  qty: 1,
                  total: product.amount,
                };
                return arr;
              }
              // Else, add new product
              return [
                ...prev,
                {
                  description: product.name,
                  price: product.amount,
                  qty: 1,
                  total: product.amount,
                },
              ];
            });
            setShowExistingProduct(false);
          }}
          onClose={() => setShowExistingProduct(false)}
        />
      )}
    </div>
  );
};

export default InvoiceNewPage;
