import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { FiBell } from 'react-icons/fi';

// Create a new Header component for the top bar
function Header() {
    const { user } = useAuth();
    return (
        <header className="bg-surface w-full py-4 px-8 flex justify-end items-center border-b">
            <div className="flex items-center gap-4">
                <button className="text-text-secondary hover:text-primary">
                    <FiBell size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
                        {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-semibold text-text-primary">{user?.full_name || 'User'}</span>
                </div>
            </div>
        </header>
    );
}

function AppLayout() {
  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-grow p-6 md:p-8">
          <Outlet /> {/* Child routes will be rendered here */}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;