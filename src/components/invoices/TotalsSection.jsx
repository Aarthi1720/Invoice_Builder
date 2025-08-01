import React from "react";
import { Plus, Trash2 } from "lucide-react";

// Format numbers as INR currency
const formatMoney = (val) =>
  typeof val === "number"
    ? val.toLocaleString("en-IN", { style: "currency", currency: "INR" })
    : val && !isNaN(val)
    ? Number(val).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      })
    : "—";

const TotalsSection = ({
  subtotal = 0,
  taxes = [],
  fees = [],
  grandTotal = 0,
  onTaxesChange,
  onFeesChange,
  readOnly = false,
}) => {
  // Tax Handlers
  const handleAddTax = () =>
    onTaxesChange?.([...taxes, { label: "", percent: "" }]);
  const handleUpdateTax = (idx, field, val) =>
    onTaxesChange?.(
      taxes.map((t, i) => (i === idx ? { ...t, [field]: val } : t))
    );
  const handleDeleteTax = (idx) =>
    taxes.length > 1 && onTaxesChange?.(taxes.filter((_, i) => i !== idx));

  // Fee Handlers
  const handleAddFee = () =>
    onFeesChange?.([...fees, { label: "", amount: "" }]);
  const handleUpdateFee = (idx, field, val) =>
    onFeesChange?.(
      fees.map((f, i) => (i === idx ? { ...f, [field]: val } : f))
    );
  const handleDeleteFee = (idx) =>
    fees.length > 1 && onFeesChange?.(fees.filter((_, i) => i !== idx));

  return (
    <div className="text-sm flex flex-col gap-3 md:mr-5">
      {/* Subtotal */}
      <div className="flex justify-end items-end">
        <div className="flex px-2 py-1 rounded-full gap-5 w-40">
          <span className="text-gray-600 font-semibold text-[16px] w-20">
            Subtotal
          </span>
          <span className="font-bold text-gray-600 text-[16px]">
            {formatMoney(subtotal)}
          </span>
        </div>
      </div>

      {/* Taxes */}
      <div className="flex flex-col gap-2 md:items-end">
        {taxes.length === 0 && (
          <div className="text-xs text-gray-400">No taxes added</div>
        )}
        {taxes.map((tax, idx) => (
          <div key={idx} className="text-gray-500 font-semibold text-[16px]">
            {readOnly ? (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <p>Tax type:</p>
                  <p className=" font-medium">{tax.label || ""}</p>
                </div>
                <div className="flex justify-between">
                  <p>Tax%:</p>
                  <p className=" font-medium">{tax.percent || ""}%</p>
                </div>
                <div className="flex justify-between md:gap-5">
                  <p>Amount:</p>
                  <p>
                    {formatMoney((subtotal * (Number(tax.percent) || 0)) / 100)}
                  </p>
                </div>
                <br />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-5 md:flex-row">
                  <div className="flex justify-between gap-2 items-center">
                    <p className=" text-gray-500 text-[16px] font-semibold">
                      Tax type
                    </p>
                    <div className="flex justify-end gap-3 font-medium">
                      <input
                        type="text"
                        placeholder="Tax Name"
                        className="w-32 border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-500 rounded px-2 py-1 text-[12px] outline-none"
                        value={tax.label}
                        onChange={(e) =>
                          handleUpdateTax(idx, "label", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="%"
                        min={0}
                        className="w-32 border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-500 rounded px-2 py-1 text-[12px] outline-none"
                        value={tax.percent}
                        onChange={(e) =>
                          handleUpdateTax(idx, "percent", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end items-end gap-4 md:-translate-y-[10px] -mt-5">
                    <p className="text-gray-500 md:hidden">Amount</p>
                    <p className="font-semibold text-gray-500">
                      {formatMoney(
                        (subtotal * (Number(tax.percent) || 0)) / 100
                      )}
                    </p>
                  </div>
                  <div className="bg-red-400 text-white py-1 rounded-full flex justify-center items-center text-[14px] md:hidden w-32">
                    <Trash2 className="w-4 h-4" />
                    <button
                      type="button"
                      className=""
                      onClick={() => handleDeleteTax(idx)}
                      disabled={taxes.length === 1}
                      title="Delete"
                    >
                      Delete Tax
                    </button>
                  </div>
                  <button
                    type="button"
                    className="p-2 rounded-full hidden md:block"
                    onClick={() => handleDeleteTax(idx)}
                    disabled={taxes.length === 1}
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {!readOnly && (
          <div className="flex justify-center items-center py-2 bg-blue-100 hover:bg-blue-100 text-blue-600 rounded transition w-full md:w-32">
            <button type="button" className="flex" onClick={handleAddTax}>
              <Plus className="w-4 h-4 mr-1" /> Add Tax
            </button>
          </div>
        )}
      </div>

      {/* Extra Fees */}
      <div className="flex flex-col gap-2 mt-2 md:items-end">
        {fees.length === 0 && (
          <div className="text-xs text-gray-400">No extra fees</div>
        )}
        {fees.map((fee, idx) => (
          <div key={idx} className="">
            {readOnly ? (
              <div className="flex flex-col gap-3 text-gray-500 font-semibold text-[16px]">
                <div className="flex justify-between md:gap-5">
                  <p>Extra fess</p>
                  <p className="font-medium">{fee.label || ""}</p>
                </div>
                <div className="flex justify-between">
                  <p>Amount:</p>
                  <p className="font-medium">{formatMoney(fee.amount)}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="md:flex md:gap-2 md:justify-center md:items-center">
                  <p className="hidden md:block text-sm text-gray-500 font-semibold">
                    Extra Fees
                  </p>
                  <div className="flex gap-5">
                    <input
                      type="text"
                      placeholder="Fee Name"
                      className="w-32 border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-2 py-1 text-[12px] outline-none"
                      value={fee.label}
                      onChange={(e) =>
                        handleUpdateFee(idx, "label", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      min={0}
                      className="w-32 border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-2 py-1 text-[12px] outline-none"
                      value={fee.amount}
                      onChange={(e) =>
                        handleUpdateFee(idx, "amount", e.target.value)
                      }
                    />
                  </div>
                  <div className="bg-red-400 text-white py-1 rounded-full flex justify-center items-center text-[14px] md:hidden mt-2 w-32">
                    <Trash2 className="w-4 h-4" />
                    <button
                      type="button"
                      className=""
                      onClick={() => handleDeleteFee(idx)}
                      disabled={fees.length === 1}
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                  <button
                    type="button"
                    className="hidden md:block"
                    onClick={() => handleDeleteFee(idx)}
                    disabled={fees.length === 1}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {!readOnly && (
          <div className="flex justify-center items-center bg-green-100 hover:bg-green-100 text-green-600 rounded transition mt-2 px-3 py-2 text-[14px]">
            <button type="button" className="flex" onClick={handleAddFee}>
              <Plus className="w-4 h-4 mr-1" /> Add Fee
            </button>
          </div>
        )}
      </div>

      <div className=" my-2" />

      {/* Grand Total */}
      <div className="md:flex md:justify-end md:items-end">
        <div className="flex gap-5 justify-between items-center bg-indigo-400 text-white p-2 px-4 rounded-md md:w-72">
          <span className="text-lg font-bold ">Total</span>
          <span className="text-lg font-bold ">{formatMoney(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
};

export default TotalsSection;
