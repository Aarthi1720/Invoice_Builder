import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInvoices } from "../context/InvoiceContext";
import { useCompany } from "../context/CompanyContext";
import { toast } from "react-toastify";
import ProductTableSection from "../components/invoices/ProductTableSection";
import TotalsSection from "../components/invoices/TotalsSection";
import ExportPDFModal from "../components/invoices/ExportPDFModal";
import BillingToForm from "../components/invoices/BillingToForm";
import InvoiceDetailsForm from "../components/invoices/InvoiceDetailsForm";
import ExistingProductModal from "../components/invoices/ExistingProductModal";
import {
  ArrowLeft,
  BadgeDollarSign,
  CheckCircle,
  Eye,
  FileDown,
  Pencil,
  Verified,
} from "lucide-react";

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, updateInvoice } = useInvoices();
  const { company } = useCompany();
  const [showExistingProduct, setShowExistingProduct] = useState(false);

  // Always load in VIEW mode first
  const [editMode, setEditMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [form, setForm] = useState(null);

  // Wait for invoices to load, then find invoice & init state
  useEffect(() => {
    if (invoices === null) return;
    const inv = invoices.find((i) => String(i.id) === String(id));
    if (inv) {
      setForm({
        billingTo: { ...inv.billingTo },
        products: Array.isArray(inv.products)
          ? inv.products.map((p) => ({ ...p }))
          : [],
        taxes: Array.isArray(inv.taxes) ? [...inv.taxes] : [],
        fees: Array.isArray(inv.fees) ? [...inv.fees] : [],
        invoiceNo: inv.invoiceNo,
        creationDate: inv.creationDate,
        dueDate: inv.dueDate,
        currency: inv.currency,
      });
      setEditMode(false); // Always start in view mode
    }
  }, [invoices, id]);

  if (invoices === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  const invoice = invoices.find((i) => String(i.id) === String(id));
  if (!invoice || !form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Invoice Not Found</h1>
      </div>
    );
  }

  // Totals calculation
  const subtotal =
    form.products?.reduce(
      (sum, p) => sum + (Number(p.price) || 0) * (Number(p.qty) || 0),
      0
    ) || 0;
  const totalTax =
    form.taxes?.reduce(
      (sum, t) => sum + (subtotal * (Number(t.percent) || 0)) / 100,
      0
    ) || 0;
  const totalFees =
    form.fees?.reduce((sum, f) => sum + (Number(f.amount) || 0), 0) || 0;
  const grandTotal = subtotal + totalTax + totalFees;

  // Update status handler
  const handleUpdateStatus = (status) => {
    updateInvoice(invoice.id, {
      ...invoice,
      ...form,
      status,
      amount: grandTotal,
    });
    setEditMode(false);
    toast.success(`Invoice marked as ${status}`);
    navigate("/invoices");
  };

  // Form update handler
  const updateForm = (fields) => {
    if (!editMode) return;
    setForm((f) => ({ ...f, ...fields }));
  };

  // UI status
  const statusLabel =
    invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1);
  const isDraft = invoice.status === "draft";
  const isUnpaid = invoice.status === "unpaid";
  const isPaid = invoice.status === "paid";

  // Edit mode toggle logic
  const handleEditModeToggle = () => {
    if (!editMode) {
      if (!isDraft) {
        toast.error("Only draft invoices can be edited.");
        return;
      }
      setEditMode(true);
    } else {
      setEditMode(false);
    }
  };

  // Add Existing Product (matches InvoiceNewPage logic)
  const handleSelectExistingProduct = (product) => {
    setForm((prev) => {
      // Find first empty row (no description, price, qty)
      const emptyIdx = prev.products.findIndex(
        (p) => !p.description && !p.price && !p.qty
      );
      if (emptyIdx !== -1) {
        const arr = [...prev.products];
        arr[emptyIdx] = {
          ...arr[emptyIdx],
          description: product.name,
          price: product.amount,
          qty: 1,
          total: product.amount,
        };
        return { ...prev, products: arr };
      }
      // Else, add new product
      return {
        ...prev,
        products: [
          ...prev.products,
          {
            description: product.name,
            price: product.amount,
            qty: 1,
            total: product.amount,
          },
        ],
      };
    });
    setShowExistingProduct(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-2">
      <div className="w-full max-w-[430px] md:max-w-3xl lg:max-w-7xl bg-white rounded-2xl shadow-md p-2 md:p-6 mb-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-300 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-blue-900 flex-1">
              Invoice Detail ({statusLabel})
            </h1>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:justify-end md:gap-3">
            <button
              className="px-3 py-2 rounded-lg space-x-2 font-medium bg-gray-100 hover:bg-gray-200 md:h-16 lg:h-12 focus:outline-none focus:border-none"
              onClick={handleEditModeToggle}
            >
              {editMode ? (
                <Eye className="w-4 h-4 inline" />
              ) : (
                <Pencil className="w-4 h-4 inline" />
              )}
              <span>{editMode ? "View Mode" : "Edit Mode"}</span>
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 md:h-16 lg:h-12 focus:outline-none focus:border-none"
              onClick={() => setShowExportModal(true)}
            >
              <FileDown className="w-5 h-5 inline-block" />
              <span className="ml-1">Export PDF</span>
            </button>
          </div>
        </div>

        {/* Banner (company details, logo, label) */}
        <div className="w-full h-48 md:h-48 rounded-2xl overflow-hidden mb-6 relative">
          <img
            src="/bgImage.jpg"
            alt="background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
          {company?.logo && (
            <img
              src={company.logo}
              alt="Logo"
              className="absolute left-6 top-6 w-16 h-16 object-cover rounded-full bg-white/70 p-1 shadow md:top-16"
              style={{ zIndex: 20 }}
            />
          )}
          <div className="absolute left-28 top-8 z-10 text-white md:top-1/2 md:-translate-y-1/2 md:-translate-x-5/6 md:left-1/2 lg:left-1/3 xl:left-1/5">
            <div className="font-bold text-lg">
              {company?.name || "[Your Company Name]"}
            </div>
            <div className="text-xs">{company?.address || "[Address]"}</div>
            <div className="text-xs">{company?.email || "[Email]"}</div>
            <div className="text-xs">{company?.phone || "[Phone]"}</div>
          </div>
          <div className="absolute left-28 bottom-5 text-white text-4xl font-bold drop-shadow lg:text-5xl xl:text-6xl  md:top-1/2 md:-translate-y-2/12 md:translate-x-1/2 md:left-1/2 lg:left-3/5 xl:left-3/5">
            Invoice
          </div>
        </div>

        {/* Forms section: BillingToForm & InvoiceDetailsForm */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mb-6">
          <div className="w-full">
            <BillingToForm
              value={form.billingTo}
              onChange={(val) => updateForm({ billingTo: val })}
              readOnly={!editMode}
            />
          </div>
          <div className="w-full">
            <InvoiceDetailsForm
              value={form}
              onChange={(val) => updateForm(val)}
              readOnly={!editMode}
            />
          </div>
        </div>

        {/* Product Table */}
        <div className="mb-6">
          <ProductTableSection
            products={form.products}
            onChange={(prods) => updateForm({ products: prods })}
            readOnly={!editMode}
          />
          {editMode && (
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

        {/* Totals Section */}
        <div className="mb-6">
          <TotalsSection
            subtotal={subtotal}
            taxes={form.taxes}
            fees={form.fees}
            grandTotal={grandTotal}
            onTaxesChange={(t) => updateForm({ taxes: t })}
            onFeesChange={(f) => updateForm({ fees: f })}
            readOnly={!editMode}
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-around mb-4">
          {editMode && isDraft && (
            <>
              <button
                className="flex-1 bg-gray-200 hover:bg-gray-300 rounded-xl px-4 py-3 font-medium flex items-center justify-center"
                onClick={() => handleUpdateStatus("draft")}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Save as Draft
              </button>
              <button
                className="flex-1 border hover:bg-red-50 border-red-400 rounded-xl px-4 py-3 font-medium text-red-600 flex items-center justify-center"
                onClick={() => handleUpdateStatus("unpaid")}
              >
                <BadgeDollarSign className="w-5 h-5 mr-2" />
                Update as Unpaid
              </button>
              <button
                className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl px-4 py-3 font-medium text-white flex items-center justify-center"
                onClick={() => handleUpdateStatus("paid")}
              >
                <Verified className="w-5 h-5 mr-2" />
                Update as Paid
              </button>
            </>
          )}
          {editMode && isUnpaid && (
            <button
              className="footer-btn-paid"
              onClick={() => handleUpdateStatus("paid")}
            >
              Update as Paid
            </button>
          )}
        </div>

        {/* PDF Export Modal */}
        {showExportModal && (
          <ExportPDFModal
            open={showExportModal}
            onClose={() => setShowExportModal(false)}
            invoiceData={{ ...invoice, ...form, company }}
          />
        )}
        {/* Existing Product Modal */}
        {showExistingProduct && (
          <ExistingProductModal
            open={showExistingProduct}
            onSelect={handleSelectExistingProduct}
            onClose={() => setShowExistingProduct(false)}
          />
        )}
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
