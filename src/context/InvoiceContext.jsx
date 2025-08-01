import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { nanoid } from "nanoid";
import { saveToStorage, getFromStorage } from "../utils/persist";
import { toast } from "react-toastify";

const InvoiceContext = createContext();

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState(null); // null = not loaded yet
  const didMount = useRef(false);

  useEffect(() => {
    getFromStorage("invoices", []).then((data) => {
      setInvoices(Array.isArray(data) ? data : []);
      didMount.current = true;
    });
  }, []);

  useEffect(() => {
    if (didMount.current) {
      saveToStorage("invoices", invoices ?? []);
    }
  }, [invoices]);

  const addInvoice = (invoice) =>
    setInvoices((prev) => [...(prev ?? []), { ...invoice, id: nanoid() }]);

  const updateInvoice = (id, data) =>
    setInvoices((prev) =>
      (prev ?? []).map((inv) => (inv.id === id ? { ...inv, ...data } : inv))
    );

  const deleteInvoice = (id) => {
    setInvoices((prev) => (prev ?? []).filter((inv) => inv.id !== id));
    toast.error("Invoice Deleted🗑️");
  };

  return (
    <InvoiceContext.Provider
      value={{ invoices, addInvoice, updateInvoice, deleteInvoice }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  return useContext(InvoiceContext);
}
