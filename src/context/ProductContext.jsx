import { nanoid } from "nanoid";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { saveToStorage, getFromStorage } from "../utils/persist";
import { toast } from "react-toastify";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const didMount = useRef(false);

  // Load from storage on mount
  useEffect(() => {
    getFromStorage("products", []).then((data) => {
      setProducts(Array.isArray(data) ? data : []);
      didMount.current = true;
    });
    // eslint-disable-next-line
  }, []);

  // Save only after initial load
  useEffect(() => {
    if (didMount.current) {
      saveToStorage("products", products);
    }
  }, [products]);

  // Add
  const addProduct = (product) =>
    setProducts((prev) => [
      ...prev,
      { ...product, id: product.id || nanoid() },
    ]);

  // Update
  const updateProduct = (id, data) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    toast.success("Product Edited ✏️");
  };

  // Delete
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.info("Product deleted🗑️");
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
