"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeModal({ isOpen, onClose, fileHash, fileName }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const copyToClipboard = () => {
    const verificationUrl = `https://your-dapp-url.com/verify/${fileHash}`;
    navigator.clipboard.writeText(verificationUrl);
    // You could add a toast notification here
  };

  if (!isOpen) return null;

  const verificationUrl = `https://your-dapp-url.com/verify/${fileHash}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Share Verification</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 mb-2">File: {fileName}</p>
          <p className="text-gray-400 text-sm font-mono">Hash: {fileHash.substring(0, 16)}...{fileHash.substring(fileHash.length - 16)}</p>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="bg-white p-4 rounded-lg mb-4">
            <QRCodeCanvas 
              value={verificationUrl}
              size={180}
              level={"H"}
              includeMargin={true}
            />
          </div>
          <p className="text-gray-400 text-sm text-center">
            Scan this QR code to verify the file on another device
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={copyToClipboard}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Copy Link
          </button>
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