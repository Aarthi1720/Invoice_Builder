import React from "react";

const formatMoney = (val, currency = "INR") =>
  typeof val === "number"
    ? val.toLocaleString("en-IN", { style: "currency", currency })
    : "—";

const InvoicePrintView = ({ invoice }) => {
  if (!invoice) return null;
  const {
    company = {},
    billingTo = {},
    products = [],
    taxes = [],
    fees = [],
    invoiceNo,
    creationDate,
    dueDate,
    currency,
  } = invoice;

  // Calculations
  const subtotal = products.reduce(
    (sum, p) => sum + (Number(p.price) || 0) * (Number(p.qty) || 0),
    0
  );
  const totalTax = taxes.reduce(
    (sum, t) => sum + (subtotal * (Number(t.percent) || 0)) / 100,
    0
  );
  const totalFees = fees.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
  const grandTotal = subtotal + totalTax + totalFees;

  return (
    <div
      className="w-full max-w-2xl mx-auto p-8 rounded-lg shadow border text-base"
      style={{
        background: "#fff",
        color: "#1a202c",
        borderColor: "#e5e7eb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Banner & Company */}
      <div
        className="w-full h-32 rounded-lg overflow-hidden mb-6 relative border"
        style={{ borderColor: "#e5e7eb" }}
      >
        <img
          src={company?.banner || "/bgImage.jpg"}
          alt="background"
          className="w-full h-full object-cover"
          style={{ opacity: 0.9 }}
        />
        {company?.logo && (
          <img
            src={company.logo}
            alt="Logo"
            className="absolute top-6 sm:top-7 left-4 w-14 h-14 object-cover bg-white/70 rounded-full p-1"
            style={{ background: "#fff" }}
          />
        )}
        <div
          className="absolute left-20 top-2 sm:top-5"
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 24,
          }}
        >
          <p>{company?.name || "[Company Name]"}</p>
          <p className="text-xs font-medium">
            {company?.address || "[Company address]"}
          </p>
          <p className="text-xs font-medium">
            {company?.email || "[Company Email]"}
          </p>
          <p className="text-xs font-medium">
            {company?.phone || "[Company phone]"}
          </p>
        </div>
        <div
          className="absolute right-2 sm:bottom-5 sm:right-5 bottom-0"
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 28,
            letterSpacing: 2,
          }}
        >
          Invoice
        </div>
      </div>

      {/* Main Info */}
      <div className="flex flex-col md:flex-row md:justify-between mb-6">
        {/* Bill To */}
        <div>
          <div className="font-bold text-lg mb-1" style={{ color: "#2563eb" }}>
            Billing To
          </div>
          <div className="mb-1">
            <span style={{ fontWeight: 600 }}>Name:</span>{" "}
            {billingTo?.name || "—"}
          </div>
          <div className="mb-1">
            <span style={{ fontWeight: 600 }}>Address:</span>{" "}
            {billingTo?.address || "—"}
          </div>
          <div className="mb-1">
            <span style={{ fontWeight: 600 }}>Mobile:</span>{" "}
            {billingTo?.mobile || "—"}
          </div>
          <div className="mb-1">
            <span style={{ fontWeight: 600 }}>Email:</span>{" "}
            {billingTo?.email || "—"}
          </div>
        </div>
        {/* Invoice Info */}
        <div className="mt-4 md:mt-0">
          <div className="flex gap-5">
            <b>Invoice #:</b>
            <p>{invoiceNo || "—"}</p>
          </div>
          <div className="flex gap-5">
            <b>Creation Date:</b>
            <p>{creationDate || "—"}</p>
          </div>
          <div className="flex gap-5">
            <b>Due Date:</b>
            <p>{dueDate || "—"}</p>
          </div>
          <div className="flex gap-5">
            <b>Currency:</b>
            <p>{currency || "INR"}</p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <table
        className="w-52 -ml-5 sm:ml-0 sm:w-full border mb-6"
        style={{ borderColor: "#e5e7eb" }}
      >
        <thead>
          <tr
            style={{ background: "#f3f4f6", borderBottom: "1px solid #e5e7eb" }}
          >
            <th className="py-2 px-1 sm:px-3 text-left">Description</th>
            <th className="py-2 px-1 sm:px-3 text-right">Price</th>
            <th className="py-2 px-1 sm:px-3 text-right">Qty</th>
            <th className="py-2 px-1 sm:px-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="text-center py-4"
                style={{ color: "#888" }}
              >
                No products added.
              </td>
            </tr>
          )}
          {products.map((item, idx) => (
            <tr
              key={idx}
              style={idx % 2 === 1 ? { background: "#f9fafb" } : undefined}
            >
              <td className="py-2 px-3">{item.description || "—"}</td>
              <td className="py-2 px-3 text-right">
                {formatMoney(Number(item.price) || 0, currency)}
              </td>
              <td className="py-2 px-3 text-right">{item.qty || 0}</td>
              <td className="py-2 px-3 text-right">
                {formatMoney(
                  (Number(item.price) || 0) * (Number(item.qty) || 0),
                  currency
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex flex-col items-end gap-1 mb-2 text-sm">
        <div>
          <span style={{ fontWeight: 500 }}>Subtotal:</span>{" "}
          <span style={{ fontWeight: 700 }}>
            {formatMoney(subtotal, currency)}
          </span>
        </div>
        {taxes &&
          taxes.length > 0 &&
          taxes.map((t, i) =>
            t.percent ? (
              <div key={i}>
                <span>
                  {t.name || "Tax"} ({t.percent}%)
                </span>{" "}
                :{" "}
                <span style={{ fontWeight: 700 }}>
                  {formatMoney(
                    (subtotal * (Number(t.percent) || 0)) / 100,
                    currency
                  )}
                </span>
              </div>
            ) : null
          )}
        {fees &&
          fees.length > 0 &&
          fees.map((f, i) =>
            f.amount ? (
              <div key={i}>
                <span>{f.name || "Extra Fees"}:</span>{" "}
                <span style={{ fontWeight: 700 }}>
                  {formatMoney(Number(f.amount) || 0, currency)}
                </span>
              </div>
            ) : null
          )}
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
          Total: {formatMoney(grandTotal, currency)}
        </div>
      </div>
    </div>
  );
};

export default InvoicePrintView;
