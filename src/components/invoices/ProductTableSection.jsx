import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Trash2 as Trash2Icon } from "lucide-react";

const ProductTableSection = ({
  products,
  onChange,
  readOnly = false,
  productList = [],
}) => {
  // Defensive: always work with arrays
  const safeProducts = Array.isArray(products) ? products : [];

  const [errors, setErrors] = useState({});
  const [initialized, setInitialized] = useState(false);

  // Ensure at least one product row exists
  useEffect(() => {
    if (!initialized && safeProducts.length === 0) {
      onChange([
        {
          id: nanoid(),
          description: "",
          price: "",
          qty: "",
        },
      ]);
      setInitialized(true);
    }
    // Don't re-trigger if already initialized
    // eslint-disable-next-line
  }, [safeProducts, initialized, onChange]);

  // Format money INR
  const formatMoney = (val) =>
    typeof val === "number"
      ? val.toLocaleString("en-IN", { style: "currency", currency: "INR" })
      : val && !isNaN(val)
      ? Number(val).toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
        })
      : "";

  const handleField = (idx, field, value) => {
    if (!onChange) return;
    const updated = safeProducts.map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    onChange(updated);
    setErrors({});
  };

  const handleAdd = () => {
    if (!onChange) return;
    onChange([
      ...safeProducts,
      { id: nanoid(), description: "", price: "", qty: "" },
    ]);
  };

  const handleDelete = (idx) => {
    if (!onChange) return;
    const newList = safeProducts.filter((_, i) => i !== idx);
    if (newList.length === 0) {
      onChange([{ id: nanoid(), description: "", price: "", qty: "" }]);
    } else {
      onChange(newList);
    }
  };

  // Validation: parent can call validateRows() before saving
  const validateRows = () => {
    let valid = true;
    let newErrors = {};
    safeProducts.forEach((p, idx) => {
      if (!p.description || !p.price || !p.qty) {
        valid = false;
        newErrors[idx] = "All fields required";
      }
    });
    setErrors(newErrors);
    return valid;
  };

  // Autocomplete (if using productList)
  const [autocompleteIdx, setAutocompleteIdx] = useState(-1);

  const applyProductAutocomplete = (idx, product) => {
    handleField(idx, "description", product.name);
    handleField(idx, "price", product.amount);
    setAutocompleteIdx(-1);
  };

  return (
    <div className="relative">
      {/* Table Head */}
      <div className="hidden md:grid grid-cols-13 bg-indigo-400 rounded-lg mb-2 border border-indigo-200 shadow">
        <div className="col-span-4 p-2 font-semibold text-white">
          Description
        </div>
        <div className="col-span-2 p-2 font-semibold text-white">Price</div>
        <div className="col-span-2 p-2 font-semibold text-white">Qty</div>
        <div className="col-span-3 p-2 font-semibold text-white text-right">
          Total
        </div>
        {!readOnly && <div className="col-span-2 p-2 text-white"></div>}
      </div>
      <div className="hidden md:block">
        {safeProducts.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`grid grid-cols-13 items-center py-2 transition hover:bg-indigo-50 ${
              errors[idx] ? "bg-red-50" : ""
            }`}
          >
            {/* Description with autocomplete */}
            <div className="col-span-4 px-2 relative md:text-[14px] text-gray-500 lg:text-[16px]">
              {readOnly ? (
                item.description || ""
              ) : (
                <>
                  <input
                    type="text"
                    className="w-full bg-transparent border-2 border-gray-400 rounded-md px-2 py-1 focus:outline-none text-gray-500 text-sm"
                    value={item.description}
                    placeholder="Description"
                    autoComplete="off"
                    onChange={(e) =>
                      handleField(idx, "description", e.target.value)
                    }
                    onFocus={() => setAutocompleteIdx(idx)}
                  />
                  {/* Autocomplete dropdown */}
                  {autocompleteIdx === idx &&
                    productList.length > 0 &&
                    item.description &&
                    !readOnly && (
                      <div className="absolute left-0 top-9 w-full bg-white border rounded z-10 max-h-32 overflow-auto shadow">
                        {productList
                          .filter((p) =>
                            p.name
                              .toLowerCase()
                              .includes(item.description.toLowerCase())
                          )
                          .map((p, i) => (
                            <div
                              key={p.id || i}
                              className="p-2 hover:bg-blue-100 cursor-pointer"
                              onClick={() => applyProductAutocomplete(idx, p)}
                            >
                              {p.name} ({formatMoney(p.amount)})
                            </div>
                          ))}
                      </div>
                    )}
                </>
              )}
            </div>
            <div className="col-span-2 px-2 md:text-[14px] text-gray-500 lg:text-[16px]">
              {readOnly ? (
                formatMoney(item.price)
              ) : (
                <input
                  type="number"
                  min={0}
                  className="w-full bg-transparent border-2 border-gray-400 rounded-md px-2 py-1 focus:outline-none text-gray-500 text-sm"
                  value={item.price}
                  placeholder="0"
                  onChange={(e) => handleField(idx, "price", e.target.value)}
                />
              )}
            </div>
            <div className="col-span-2 px-2 md:text-[14px] text-gray-500 lg:text-[16px]">
              {readOnly ? (
                item.qty || ""
              ) : (
                <input
                  type="number"
                  min={1}
                  className="w-full bg-transparent border-2 border-gray-400 rounded-md px-2 py-1 focus:outline-none text-gray-500 text-sm"
                  value={item.qty}
                  placeholder="0"
                  onChange={(e) => handleField(idx, "qty", e.target.value)}
                />
              )}
            </div>
            <div className="col-span-3 px-2 text-gray-500 text-right">
              {formatMoney((Number(item.price) || 0) * (Number(item.qty) || 0))}
            </div>
            {!readOnly && (
              <div className="col-span-2 px-2 text-center">
                {/* Always show trash icon */}
                <button
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                  onClick={() => handleDelete(idx)}
                  type="button"
                >
                  <Trash2Icon className="w-5 h-5" />
                </button>
              </div>
            )}
            {errors[idx] && (
              <div className="col-span-13 px-2 text-xs text-red-500">
                {errors[idx]}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Mobile Card View */}
      <div className="block md:hidden text-[16px]">
        {safeProducts.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`rounded-lg mb-2 ${
              errors[idx] ? "border border-red-300" : ""
            }`}
          >
            {readOnly ? (
              <div className="flex flex-col gap-3 text-gray-600 text-[16px] font-medium">
                <div className="flex justify-between">
                  <p>Description:</p>
                  <p className="text-gray-500">{item.description || ""}</p>
                </div>
                <div className="flex justify-between">
                  <p>Price:</p>
                  <p className="text-gray-500">{item.price || ""}</p>
                </div>
                <div className="flex justify-between">
                  <p>Quantity:</p>
                  <p className="text-gray-500">{item.qty || ""}</p>
                </div>
                <div className="flex justify-between">
                  <p>Total:</p>
                  <p className="text-gray-500">
                    {formatMoney(
                      (Number(item.price) || 0) * (Number(item.qty) || 0)
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Description</span>
                  <input
                    type="text"
                    className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
                    value={item.description}
                    placeholder="Product Name"
                    autoComplete="off"
                    onChange={(e) =>
                      handleField(idx, "description", e.target.value)
                    }
                    disabled={readOnly}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Price</span>
                  <input
                    type="number"
                    min={0}
                    className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
                    value={item.price}
                    placeholder="Price"
                    onChange={(e) => handleField(idx, "price", e.target.value)}
                    disabled={readOnly}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Quantity</span>
                  <input
                    type="number"
                    min={1}
                    className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-sm outline-none"
                    value={item.qty}
                    placeholder="Qty"
                    onChange={(e) => handleField(idx, "qty", e.target.value)}
                    disabled={readOnly}
                  />
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600 font-semibold">Total</p>
                  <span className="font-bold text-gray-600">
                    {formatMoney(
                      (Number(item.price) || 0) * (Number(item.qty) || 0)
                    )}
                  </span>
                </div>
                {!readOnly && (
                  <div className="flex bg-red-400 text-white justify-center items-center py-2 rounded-md">
                    <Trash2Icon className="w-5 h-5" />
                    <button
                      className="rounded-md"
                      onClick={() => handleDelete(idx)}
                      type="button"
                    >
                      Delete product
                    </button>
                  </div>
                )}
                {errors[idx] && (
                  <div className="text-xs text-red-500">{errors[idx]}</div>
                )}
                {!readOnly && (
                  <div>
                    <button
                      onClick={handleAdd}
                      className="bg-blue-600 text-white px-6 py-2 rounded-xl mt-2 shadow hover:bg-blue-700 transition w-full"
                      type="button"
                    >
                      + Add Product
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Add Product (desktop) */}
      {!readOnly && (
        <button
          onClick={handleAdd}
          className=" bg-blue-600 text-white rounded-lg px-3 py-2 text-sm shadow hover:bg-blue-700 transition hidden md:block absolute right-48 mt-2"
          type="button"
        >
          + Add Product
        </button>
      )}
    </div>
  );
};

export default ProductTableSection;
