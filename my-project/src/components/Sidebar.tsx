// Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-blue-600 to-indigo-800 shadow-lg text-white fixed flex flex-col">
      {/* Wallet Selector Section */}
      <div className="p-6 border-b border-indigo-700 flex flex-col items-center">
        <WalletSelector /> {/* WalletSelector at the top */}
      </div>

      {/* Aptos Marketplace Branding directly below WalletSelector */}
      <div className="p-6 text-center mt-4 opacity-80">
        <p>Aptos Marketplace</p>
      </div>

      {/* Navigation Links right after WalletSelector */}
      <nav className="flex flex-col px-6 py-4 space-y-4 text-lg">
        <Link 
          to="/" 
          className="hover:bg-indigo-700 hover:bg-opacity-50 rounded-md py-2 px-4 transition duration-200"
        >
          Home
        </Link>
        <Link 
          to="/marketplace" 
          className="hover:bg-indigo-700 hover:bg-opacity-50 rounded-md py-2 px-4 transition duration-200"
        >
          Marketplace
        </Link>
        <Link 
          to="/profile" 
          className="hover:bg-indigo-700 hover:bg-opacity-50 rounded-md py-2 px-4 transition duration-200"
        >
          Profile
        </Link>
      </nav>
      <div className="mt-auto p-6 border-t border-indigo-700 text-sm text-center opacity-75">
        © 2024 Aptos Marketplace
      </div>
    </aside>
  );
};

export default Sidebar;
