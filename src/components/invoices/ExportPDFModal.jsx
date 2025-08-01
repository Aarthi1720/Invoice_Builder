import React, { useEffect, useRef } from "react";
import InvoicePrintView from "./InvoicePrintView";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Loader2 } from "lucide-react";

const ExportPDFModal = ({ open, onClose, invoiceData }) => {
  const printRef = useRef();

  if (!open) return null;

  // Simple check: If not ready, show loader
  if (!invoiceData || !invoiceData.products) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full m-4 flex flex-col items-center p-8">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600 mb-4" />
          <span className="text-lg">Loading invoice...</span>
        </div>
      </div>
    );
  }

  // Prevent background scroll when modal open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Reset scroll on close
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // --- Download PDF using jsPDF + html2canvas ---
  const handleDownload = async () => {
    const input = printRef.current;
    if (!input) return;

    // Use html2canvas to capture element as image
    const canvas = await html2canvas(input, {
      scale: 2, // sharpness
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    // Set PDF page size to A4 in px (for 96 DPI screens: 794x1123 px)
    const pdfWidth = 210; // mm
    const pdfHeight = 297; // mm

    // Calculate aspect ratio to fit the image in A4
    const imgProps = {
      width: canvas.width,
      height: canvas.height,
    };
    const aspectRatio = imgProps.width / imgProps.height;

    let pdfImgWidth = pdfWidth;
    let pdfImgHeight = pdfWidth / aspectRatio;
    if (pdfImgHeight > pdfHeight) {
      pdfImgHeight = pdfHeight;
      pdfImgWidth = pdfHeight * aspectRatio;
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Center the image on the PDF page
    const x = (pdfWidth - pdfImgWidth) / 2;
    const y = 10; // Top margin (10mm)
    pdf.addImage(imgData, "PNG", x, y, pdfImgWidth, pdfImgHeight);

    pdf.save(`Invoice_${invoiceData.invoiceNo || "Invoice"}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className="bg-white rounded-xl shadow-xl max-w-6xl w-full m-0 md:m-4 flex flex-col h-full md:h-auto  overflow-y-auto"
        style={{ maxHeight: "100vh" }}
      >
        {/* Preview */}
        <div
          className="flex-1 p-2 md:p-6 overflow-auto"
          style={{ minWidth: 0, maxHeight: "80vh" }}
        >
          <div ref={printRef}>
            <InvoicePrintView invoice={invoiceData} />
          </div>
        </div>
        {/* Settings/Actions */}
        <div
          className="w-full flex flex-col mt-5 justify-center items-center sm:flex-row gap-2 md:gap-5 p-2 sm:p-4"
          style={{ background: "#f9fafb" }}
        >
          <button
            style={{
              background: "#2563eb",
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
            }}
            className="w-60 py-3 rounded-lg mb-2 hover:cursor-pointer"
            onClick={handleDownload}
          >
            Download PDF
          </button>
          <button
            style={{
              background: "#e5e7eb",
              color: "#374151",
              fontWeight: 700,
              fontSize: 18,
            }}
            className="w-60 py-3 rounded-lg mb-2 hover:cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPDFModal;
