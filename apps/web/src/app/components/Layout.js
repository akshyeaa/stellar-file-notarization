"use client";

import { usePathname } from 'next/navigation';

export default function Layout({ children }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Registry', path: '/registry' },
    { name: 'About', path: '/about' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">File Notarization DApp</h1>
            <nav>
              <ul className="flex space-x-6">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <a 
                      href={item.path} 
                      className={`${pathname === item.path ? 'text-blue-400' : 'text-gray-300 hover:text-white'} transition-colors`}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold">File Notarization DApp</h3>
              <p className="text-gray-400 text-sm">Secure, decentralized file verification</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>© 2025 File Notarization DApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}