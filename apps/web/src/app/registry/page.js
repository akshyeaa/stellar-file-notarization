"use client";

import { useState, useEffect } from "react";
import QRCodeModal from "../components/QRCodeModal";

export default function Registry() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // Simulate fetching public registry data
    setTimeout(() => {
      const mockFiles = [
        {
          id: 1,
          fileName: "document.pdf",
          hash: "a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890",
          owner: "GDTAQTF4VXQWUKJCI3PEYL74WAA54E2UMXTWGCT2BUMD4YZEU3YCGNMP",
          timestamp: "2025-11-05T10:30:00Z",
          txHash: "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567"
        },
        {
          id: 2,
          fileName: "contract.docx",
          hash: "f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9",
          owner: "GBQ5NLZZO5EBHL3QNN6FZRM63WEG57CX6JGNB3MMGIRL4OCEVOI2RXG2",
          timestamp: "2025-11-04T14:15:00Z",
          txHash: "xyz987uvw654tsr321qpo098nml765kji432hgf109edcba876"
        },
        {
          id: 3,
          fileName: "agreement.txt",
          hash: "c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8",
          owner: "GDTAQTF4VXQWUKJCI3PEYL74WAA54E2UMXTWGCT2BUMD4YZEU3YCGNMP",
          timestamp: "2025-11-03T09:45:00Z",
          txHash: "mno345pqr678stu901vwx234yz567abc123def456ghi789jkl012"
        }
      ];
      setFiles(mockFiles);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredFiles = files.filter(file => 
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openQRModal = (file) => {
    setSelectedFile(file);
    setIsQRModalOpen(true);
  };

  const closeQRModal = () => {
    setIsQRModalOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Public Registry</h2>
        
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search files by name, hash, or owner..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">
              Notarized Files {filteredFiles.length > 0 && `(${filteredFiles.length})`}
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <p>Loading public registry...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-8">
                <p>No files found matching your search.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-3 px-4 text-left">File Name</th>
                      <th className="py-3 px-4 text-left">Owner</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-3 px-4">{file.fileName}</td>
                        <td className="py-3 px-4 font-mono text-sm">
                          {file.owner.substring(0, 6)}...{file.owner.substring(file.owner.length - 4)}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(file.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <a 
                              href={`https://stellar.expert/explorer/testnet/tx/${file.txHash}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              Blockchain
                            </a>
                            <button 
                              onClick={() => openQRModal(file)}
                              className="text-gray-400 hover:text-white"
                            >
                              QR
                            </button>
                          </div>
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

      {/* QR Code Modal */}
      <QRCodeModal 
        isOpen={isQRModalOpen}
        onClose={closeQRModal}
        fileHash={selectedFile?.hash}
        fileName={selectedFile?.fileName}
      />
    </div>
  );
}