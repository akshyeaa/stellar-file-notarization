"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

export default function CertificateGenerator({ notarizationData, onClose }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState("");

  const generateCertificate = async () => {
    if (!notarizationData) return;
    
    setIsGenerating(true);
    
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(24);
      doc.text("File Notarization Certificate", 105, 20, null, null, "center");
      
      // Add decorative line
      doc.setLineWidth(0.5);
      doc.line(20, 30, 190, 30);
      
      // Add file information
      doc.setFontSize(12);
      doc.text("File Information", 20, 45);
      
      doc.setFontSize(10);
      doc.text("File Hash:", 20, 55);
      doc.setFont(undefined, "bold");
      doc.text(notarizationData.hash, 20, 60);
      
      doc.setFont(undefined, "normal");
      doc.text("File Owner:", 20, 70);
      doc.setFont(undefined, "bold");
      doc.text(notarizationData.owner, 20, 75);
      
      // Add timestamp
      const date = new Date(notarizationData.timestamp * 1000);
      doc.setFont(undefined, "normal");
      doc.text("Notarization Date:", 20, 85);
      doc.setFont(undefined, "bold");
      doc.text(date.toLocaleString(), 20, 90);
      
      // Add transaction information
      doc.setFont(undefined, "normal");
      doc.text("Transaction Hash:", 20, 100);
      doc.setFont(undefined, "bold");
      doc.text(notarizationData.txHash, 20, 105);
      
      // Add blockchain information
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text("Blockchain:", 20, 120);
      doc.setFontSize(10);
      doc.text("Stellar Testnet", 20, 125);
      
      // Add verification instructions
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text("To verify this notarization, visit:", 20, 140);
      doc.setTextColor(0, 0, 255);
      doc.text("https://stellar.expert/explorer/testnet/tx/" + notarizationData.txHash, 20, 145);
      
      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text("This certificate confirms that the file hash has been notarized", 105, 170, null, null, "center");
      doc.text("on the Stellar blockchain at the timestamp shown above.", 105, 175, null, null, "center");
      
      // Generate PDF as data URL
      const pdfData = doc.output('datauristring');
      setCertificateUrl(pdfData);
      setIsGenerating(false);
    } catch (error) {
      console.error("Error generating certificate:", error);
      setIsGenerating(false);
    }
  };

  const downloadCertificate = () => {
    if (!certificateUrl) return;
    
    // Create download link
    const link = document.createElement('a');
    link.href = certificateUrl;
    link.download = `notarization-certificate-${notarizationData.hash.substring(0, 8)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Notarization Certificate</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-2">File successfully notarized on the Stellar blockchain!</p>
          
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-400">File Hash:</div>
              <div className="font-mono text-xs truncate">{notarizationData?.hash}</div>
              
              <div className="text-gray-400">Owner:</div>
              <div className="font-mono text-xs truncate">{notarizationData?.owner}</div>
              
              <div className="text-gray-400">Timestamp:</div>
              <div>{new Date(notarizationData?.timestamp * 1000).toLocaleString()}</div>
              
              <div className="text-gray-400">Transaction:</div>
              <div className="font-mono text-xs truncate">{notarizationData?.txHash}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mb-6">
          {certificateUrl ? (
            <div className="text-center">
              <div className="bg-gray-700 border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center mb-4 mx-auto">
                <span className="text-gray-500">PDF Icon</span>
              </div>
              <p className="text-green-400 mb-2">Certificate generated successfully!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-gray-700 border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center mb-4">
                <span className="text-gray-500">Certificate</span>
              </div>
              <button
                onClick={generateCertificate}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
              >
                {isGenerating ? "Generating Certificate..." : "Generate Certificate"}
              </button>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          {certificateUrl && (
            <button
              onClick={downloadCertificate}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Download PDF
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}