"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { connectFreighter } from "../../lib/stellar";

export default function Dashboard() {
  const [wallet, setWallet] = useState("");
  const [notarizedFiles, setNotarizedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // In a real implementation, you would fetch the user's notarized files from the blockchain
        // For now, we'll just check if the wallet is connected
        const addr = await connectFreighter();
        setWallet(addr);
        // Simulate fetching notarized files
        setTimeout(() => {
          setNotarizedFiles([
            {
              id: 1,
              fileName: "document.pdf",
              hash: "a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890",
              timestamp: "2025-11-05T10:30:00Z",
              txHash: "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567"
            },
            {
              id: 2,
              fileName: "contract.docx",
              hash: "f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9",
              timestamp: "2025-11-04T14:15:00Z",
              txHash: "xyz987uvw654tsr321qpo098nml765kji432hgf109edcba876"
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (e) {
        // If wallet is not connected, redirect to home
        router.push("/");
      }
    };

    checkWalletConnection();
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Your Dashboard</h2>
          <div className="text-right">
            <p className="text-gray-400">Connected Wallet:</p>
            <p className="font-mono text-sm">{wallet.substring(0, 6)}...{wallet.substring(wallet.length - 4)}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Notarized Files</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <p>Loading your notarized files...</p>
              </div>
            ) : notarizedFiles.length === 0 ? (
              <div className="text-center py-8">
                <p>You haven't notarized any files yet.</p>
                <a href="/" className="text-blue-400 hover:underline mt-2 inline-block">
                  Notarize your first file →
                </a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-3 px-4 text-left">File Name</th>
                      <th className="py-3 px-4 text-left">Hash</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notarizedFiles.map((file) => (
                      <tr key={file.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-3 px-4">{file.fileName}</td>
                        <td className="py-3 px-4 font-mono text-sm">
                          {file.hash.substring(0, 12)}...{file.hash.substring(file.hash.length - 12)}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(file.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <a 
                            href={`https://stellar.expert/explorer/testnet/tx/${file.txHash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            View on Blockchain
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}