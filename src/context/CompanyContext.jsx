import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { saveToStorage, getFromStorage } from "../utils/persist";
import { toast } from "react-toastify";

const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const [company, setCompany] = useState({
    name: "",
    logo: "",
    address: "",
    email: "",
    phone: "",
  });
  const didMount = useRef(false);

  useEffect(() => {
    getFromStorage("company", {
      name: "",
      logo: "",
      address: "",
      email: "",
      phone: "",
    }).then((data) => {
      setCompany({ ...data });
      didMount.current = true;
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (didMount.current) {
      saveToStorage("company", company);
    }
  }, [company]);

  // Update the entire company info
  const updateCompany = (data) => setCompany((prev) => ({ ...prev, ...data }));

  // *** CLEAR FUNCTION HERE ***
  const clearCompany = () => {
    setCompany({
      name: "",
      logo: "",
      address: "",
      email: "",
      phone: "",
    });
    saveToStorage("company", {
      name: "",
      logo: "",
      address: "",
      email: "",
      phone: "",
    });
    toast.error("Business Info deleted🗑️");
  };

  return (
    <CompanyContext.Provider value={{ company, updateCompany, clearCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  return useContext(CompanyContext);
}
