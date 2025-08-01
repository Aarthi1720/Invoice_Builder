import React from "react";

const currencies = [
  { label: "INR (₹)", value: "INR" },
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
];

const InvoiceDetailsForm = ({ value = {}, onChange, readOnly = false }) => {
  // On any field change, update parent
  const emitChange = (fields) => {
    onChange?.({ ...value, ...fields });
  };

  if (readOnly) {
    // Display-only, no inputs
    return (
      <div className="flex flex-col gap-3 text-[16px]">
        <div className="flex justify-between lg:justify-end lg:gap-32">
          <p className="font-medium text-gray-700">Invoice #:</p>{" "}
          <p className="text-gray-600 text-[14px]">{value.invoiceNo || "—"}</p>
        </div>
        <div className="flex justify-between lg:justify-end lg:gap-[69px]">
          <span className="font-medium text-gray-700">Creation Date:</span>{" "}
          <span className="text-gray-600 text-[14px]">
            {value.creationDate || ""}
          </span>
        </div>
        <div className="flex justify-between lg:justify-end lg:gap-[69px]">
          <span className="font-medium text-gray-700">Due Date:</span>{" "}
          <span className="text-gray-600 text-[14px]">
            {value.dueDate || ""}
          </span>
        </div>
        <div className="flex justify-between lg:justify-end lg:gap-24">
          <span className="font-medium text-gray-700">Currency:</span>{" "}
          <span className="text-gray-600 text-[14px]">
            {currencies.find((c) => c.value === value.currency)?.label ||
              value.currency ||
              ""}
          </span>
        </div>
      </div>
    );
  }

  // Editable mode (form)
  return (
    <div className="flex flex-col gap-3 text-[14px] ">
      <div className="flex justify-between gap-5 xl:justify-end xl:gap-2">
        <span className="text-gray-700 font-semibold">Invoice#</span>
        <input
          type="text"
          className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none text-right"
          placeholder="Invoice No"
          value={value.invoiceNo || ""}
          onChange={(e) => emitChange({ invoiceNo: e.target.value })}
          autoComplete="off"
        />
      </div>
      <div className="flex justify-between xl:justify-end xl:gap-14">
        <span className="text-gray-700 font-semibold">Creation Date</span>
        <input
          type="date"
          className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
          value={value.creationDate || ""}
          onChange={(e) => emitChange({ creationDate: e.target.value })}
          required
        />
      </div>
      <div className="flex justify-between xl:justify-end xl:gap-14">
        <span className="text-gray-700 font-semibold">Due Date</span>
        <input
          type="date"
          className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
          value={value.dueDate || ""}
          onChange={(e) => emitChange({ dueDate: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-between xl:justify-end xl:gap-26">
        <span className="text-gray-700 font-semibold">Currency</span>
        <select
          className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
          value={value.currency || "INR"}
          onChange={(e) => emitChange({ currency: e.target.value })}
        >
          {currencies.map((cur) => (
            <option key={cur.value} value={cur.value}>
              {cur.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InvoiceDetailsForm;
