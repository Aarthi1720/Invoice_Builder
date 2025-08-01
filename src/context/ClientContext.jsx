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

const ClientContext = createContext();

export function ClientProvider({ children }) {
  const [clients, setClients] = useState([]);
  const didMount = useRef(false);

  // Load on mount
  useEffect(() => {
    getFromStorage("clients", []).then((data) => {
      setClients(Array.isArray(data) ? data : []);
      didMount.current = true;
    });
    // eslint-disable-next-line
  }, []);

  // Save only after initial load
  useEffect(() => {
    if (didMount.current) {
      saveToStorage("clients", clients);
    }
  }, [clients]);

  // Add
  const addClient = (client) =>
    setClients((prev) => [...prev, { ...client, id: nanoid() }]);

  // Update
  const updateClient = (id, data) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
    toast.info("Client Edited✏️");
  };

  // Delete
  const deleteClient = (id) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    toast.error("Client deleted🗑️");
  };
  return (
    <ClientContext.Provider
      value={{ clients, addClient, updateClient, deleteClient }}
    >
      {children}
    </ClientContext.Provider>
  );
}

// Usage: const { clients, addClient, updateClient, deleteClient } = useClients();
export function useClients() {
  return useContext(ClientContext);
}
