import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function AppLayout() {
  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      <main className="flex-grow p-8">
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
    </div>
  );
}

export default AppLayout;