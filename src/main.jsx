// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClientProvider } from "./context/ClientContext";
import { ProductProvider } from "./context/ProductContext";
import { InvoiceProvider } from "./context/InvoiceContext";
import { CompanyProvider } from "./context/CompanyContext";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <InvoiceProvider>
    <CompanyProvider>
      <ClientProvider>
        <ProductProvider>
          <App />
        </ProductProvider>
      </ClientProvider>
    </CompanyProvider>
  </InvoiceProvider>

  // </StrictMode>,
);
