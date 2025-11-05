"use client";

import { useState } from "react";
import { connectFreighter, verifyFile, notarizeFile } from "../lib/stellar";

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState("");

  // Connect wallet
  const connect = async () => {
    try {
      const addr = await connectFreighter();
      setWallet(addr);
      setStatus("✅ Connected: " + addr);
    } catch (e) {
      setStatus("❌ Wallet connection failed: " + e.message);
    }
  };

  // Handle file upload & hash
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setHash(hashHex);
      setStatus("📁 File hash generated: " + hashHex);
    } catch (e) {
      setStatus("❌ Error generating file hash: " + e.message);
    }
  };

  // Verify hash on blockchain
  const verify = async () => {
    try {
      if (!hash) {
        setStatus("❌ No file selected. Please upload a file first.");
        return;
      }
      
      setStatus("🔍 Verifying file on blockchain...");
      const result = await verifyFile(hash);
      if (result) {
        setStatus("✅ Success! This file is already notarized on the blockchain.");
      } else {
        setStatus("❌ This file is not found in notarization records. You can notarize it now!");
      }
    } catch (e) {
      setStatus("❌ Verification failed: " + e.message);
    }
  };

  // Notarize hash on blockchain
  const notarize = async () => {
    try {
      if (!wallet) {
        setStatus("❌ Please connect your wallet first");
        return;
      }
      
      if (!hash) {
        setStatus("❌ No file selected. Please upload a file first.");
        return;
      }
      
      setStatus("📝 Notarizing file on blockchain...");
      const tx = await notarizeFile(wallet, hash);
      setStatus("✅ Success! File notarized on blockchain. TX Hash: " + tx);
      console.log(`🔗 View transaction: https://stellar.expert/explorer/testnet/tx/${tx}`);
    } catch (e) {
      setStatus("❌ Notarization failed: " + e.message);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen space-y-4 p-4">
      <h1 className="text-3xl font-bold">File Notarization DApp</h1>
      <p className="text-gray-400 text-center max-w-md">
        Upload a file to generate its SHA-256 hash, then verify if it's already notarized or notarize it on the Stellar blockchain.
      </p>

      <button
        onClick={connect}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        {wallet ? "✅ Wallet Connected" : "🔌 Connect Freighter Wallet"}
      </button>

      <div className="flex flex-col items-center space-y-2">
        <label className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
          📁 Choose File
          <input
            type="file"
            onChange={handleFile}
            className="hidden"
          />
        </label>
        {hash && (
          <p className="text-xs text-gray-400 mt-1">
            File hash: {hash.substring(0, 16)}...{hash.substring(hash.length - 16)}
          </p>
        )}
      </div>

      {hash && (
        <div className="flex space-x-4">
          <button
            onClick={verify}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🔍 Verify
          </button>

          <button
            onClick={notarize}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            📝 Notarize
          </button>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-800 rounded-lg max-w-md">
        <p className="text-sm text-gray-200 whitespace-pre-wrap">{status}</p>
      </div>
    </main>
  );
}