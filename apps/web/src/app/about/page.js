"use client";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">About File Notarization DApp</h2>
        
        <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">What is File Notarization?</h3>
            <p className="mb-4">
              File notarization is the process of verifying and recording the existence of a document or file at a specific point in time. 
              Our decentralized application (dApp) leverages the Stellar blockchain to provide immutable proof of existence for your digital files.
            </p>
            <p className="mb-4">
              When you notarize a file with our system, we generate a cryptographic hash of your file and store it on the Stellar blockchain. 
              This creates a permanent, tamper-proof record that can be used to prove the file existed at a specific time and hasn't been altered.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">How It Works</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Upload a file to the application</li>
                <li>We generate a SHA-256 hash of your file</li>
                <li>Connect your Freighter wallet</li>
                <li>Submit the hash to the Stellar blockchain</li>
                <li>Receive a transaction confirmation</li>
                <li>Verify the file's authenticity anytime</li>
              </ol>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Benefits</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Immutable proof of existence</li>
                <li>Decentralized and trustless verification</li>
                <li>Low-cost blockchain transactions</li>
                <li>Privacy-focused (only hashes are stored)</li>
                <li>Permanent record on the Stellar network</li>
                <li>Easy verification through public registry</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Technology Stack</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-700 rounded-lg p-4">
                <h4 className="font-bold mb-2">Frontend</h4>
                <ul className="space-y-1">
                  <li>Next.js 16</li>
                  <li>React</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
              <div className="border border-gray-700 rounded-lg p-4">
                <h4 className="font-bold mb-2">Blockchain</h4>
                <ul className="space-y-1">
                  <li>Stellar Network</li>
                  <li>Soroban Smart Contracts</li>
                  <li>Rust</li>
                </ul>
              </div>
              <div className="border border-gray-700 rounded-lg p-4">
                <h4 className="font-bold mb-2">Wallet Integration</h4>
                <ul className="space-y-1">
                  <li>Freighter Wallet</li>
                  <li>Stellar SDK</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}