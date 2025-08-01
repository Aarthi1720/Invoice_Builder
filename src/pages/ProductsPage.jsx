import React, { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import ProductTable from "../components/products/ProductTable";
import EditProductModal from "../components/products/EditProductModal";
import ConfirmationDeleteModal from "../components/common/ConfirmationDeleteModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// AddProductForm inline
const AddProductForm = ({ onSubmit }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) {
      toast.error("All fields are required⚠️");
      return;
    }
    onSubmit({ id, name, amount: Number(amount) });
    setId("");
    setName("");
    setAmount("");
    toast.success("Product added👍");
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        type="text"
        className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-[16px] outline-none"
        placeholder="Product ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        autoComplete="off"
      />
      <input
        type="text"
        className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-[16px] outline-none"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="off"
      />
      <input
        type="number"
        className="border-[2px] border-gray-400 placeholder:text-gray-500 caret-blue-500 text-gray-600 rounded px-3 py-2 text-[16px] outline-none"
        placeholder="Product Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min={0}
        autoComplete="off"
      />
      <button
        type="submit"
        className="mt-2 bg-gradient-to-br from-[#708ae9] to-[#5a4de8] text-white font-semibold rounded-xl py-2 transition hover:cursor-pointer hover:bg-gradient-to-tl hover:from-[#708ae9] hover:to-[#5a4de8] duration-500 active:scale-90"
      >
        Save
      </button>
    </form>
  );
};

const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Search logic
  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  // Handlers
  const handleAddProduct = (product) => addProduct(product);

  const handleEdit = (id) => {
    const product = products.find((p) => p.id === id);
    setEditProduct(product);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setPendingDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  return (
    <div className="w-full min-h-screen p-4 flex flex-col">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-300 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-blue-900">Products</h1>
        </div>
        {/* Advanced Search */}
        <div className="relative">
          <input
            className="border-[3px] rounded-lg py-2 px-3 pl-9 text-gray-500 text-sm border-gray-400 w-full focus:outline-none caret-blue-500"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>
      {/* Main grid: left (list) and right (form) */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Product list */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow p-4 flex-1">
            <ProductTable
              products={filtered}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </div>
        </div>
        {/* Right: Add Product form */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2 text-blue-900">
              Add Product
            </h2>
            <AddProductForm onSubmit={handleAddProduct} />
          </div>
        </div>
      </div>
      {/* Edit Modal */}
      <EditProductModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        product={editProduct}
        onSave={updateProduct}
      />
      {/* Delete Confirmation Modal */}
      <ConfirmationDeleteModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={() => pendingDeleteId && deleteProduct(pendingDeleteId)}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default ProductsPage;
