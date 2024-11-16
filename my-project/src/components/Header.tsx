// Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold">Welcome, User</h1>
      <div className="flex items-center">
        {/* Profile Picture - Link to Profile page */}
        <Link to="/profile">
          <img 
            src="https://via.placeholder.com/40" 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-indigo-500 cursor-pointer"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
