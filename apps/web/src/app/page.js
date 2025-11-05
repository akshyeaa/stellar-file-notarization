"use client";

import { useState } from "react";
import { connectFreighter, verifyFileWithDetails, notarizeFile } from "../lib/stellar";
import Head from 'next/head';
import CertificateGenerator from './components/CertificateGenerator';

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState("");
  const [notarizationResult, setNotarizationResult] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

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
      setStatus("📁 File hash generated: " + hashHex.substring(0, 16) + "..." + hashHex.substring(hashHex.length - 16));
      setNotarizationResult(null);
      setShowCertificate(false);
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
      const result = await verifyFileWithDetails(hash);
      if (result.notarized) {
        setStatus(`✅ Success! This file is already notarized on the blockchain.\nOwner: ${result.owner}\nNotarized on: ${result.timestamp}`);
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
      const result = await notarizeFile(wallet, hash);
      
      const notarizationData = {
        hash: hash,
        owner: wallet,
        txHash: result.hash,
        timestamp: result.timestamp
      };
      
      setNotarizationResult(notarizationData);
      setShowCertificate(true);
      
      setStatus(`✅ Success! File notarized on blockchain.\nTransaction Hash: ${result.hash}\nTimestamp: ${new Date(result.timestamp * 1000).toLocaleString()}`);
      console.log(`🔗 View transaction: https://stellar.expert/explorer/testnet/tx/${result.hash}`);
    } catch (e) {
      setStatus("❌ Notarization failed: " + e.message);
    }
  };

  const closeCertificate = () => {
    setShowCertificate(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>File Notarization DApp</title>
        <meta name="description" content="Notarize your files on the Stellar blockchain" />
      </Head>

      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Secure File Notarization</h2>
            <p className="text-gray-300 mb-8">
              Upload a file to generate its SHA-256 hash, then verify if it's already notarized or notarize it on the Stellar blockchain.
            </p>
          </div>

          <div className="space-y-6">
            {/* Wallet Connection */}
            <div className="text-center">
              <button
                onClick={connect}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                {wallet ? "✅ Wallet Connected" : "🔌 Connect Freighter Wallet"}
              </button>
              {wallet && (
                <p className="mt-2 text-sm text-gray-400">Connected: {wallet.substring(0, 6)}...{wallet.substring(wallet.length - 4)}</p>
              )}
            </div>

            {/* File Upload */}
            <div className="text-center">
              <label className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition-colors duration-300 block">
                📁 Choose File
                <input
                  type="file"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>
              {hash && (
                <p className="mt-2 text-sm text-gray-400">
                  File hash: {hash.substring(0, 16)}...{hash.substring(hash.length - 16)}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {hash && (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={verify}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  🔍 Verify
                </button>

                <button
                  onClick={notarize}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  📝 Notarize
                </button>
              </div>
            )}

            {/* Status Display */}
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="font-bold mb-2">Status:</h3>
              <p className="text-sm whitespace-pre-wrap">{status}</p>
              
              {notarizationResult && (
                <div className="mt-4 p-3 bg-gray-600 rounded">
                  <h4 className="font-bold mb-2">Notarization Details:</h4>
                  <p className="text-sm">Transaction Hash: {notarizationResult.txHash}</p>
                  <p className="text-sm">Timestamp: {new Date(notarizationResult.timestamp * 1000).toLocaleString()}</p>
                  <a 
                    href={`https://stellar.expert/explorer/testnet/tx/${notarizationResult.txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-sm mt-2 inline-block"
                  >
                    View on Stellar Expert →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Generator Modal */}
      {showCertificate && notarizationResult && (
        <CertificateGenerator 
          notarizationData={notarizationResult}
          onClose={closeCertificate}
        />
      )}
    </div>
  );
}