// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth for logout

// Example icons (install react-icons: npm install react-icons)
import { FiGrid, FiBarChart2, FiMessageSquare, FiLogOut, FiSettings, FiDroplet } from 'react-icons/fi'; // Droplet for soil


function Sidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login after logout
    };

    const linkClasses = ({ isActive }) =>
        `flex items-center gap-3 py-2.5 px-4 rounded transition duration-200 hover:bg-green-100 hover:text-primary ${
          isActive ? 'bg-green-200 text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'
        }`;


  return (
    <aside className="w-64 bg-surface text-text-primary p-4 shadow-lg flex flex-col h-screen sticky top-0"> {/* Make sidebar full height and sticky */}
      <div className="mb-8 text-2xl font-bold text-primary text-center py-4 border-b">
        🌿 GreenFund
      </div>
      <nav className="flex-grow space-y-2"> {/* flex-grow pushes logout down */}
        <NavLink to="/app/dashboard" className={linkClasses} end> {/* Added 'end' prop */}
            <FiGrid /> Dashboard
        </NavLink>
        <NavLink to="/app/soil-analysis" className={linkClasses}>
            <FiDroplet /> Analyze Soil
        </NavLink>
        {/* --- NEW: Forum Link --- */}
        <NavLink to="/app/forum" className={linkClasses}>
            <FiMessageSquare /> Community Forum
        </NavLink>
         {/* --- End New --- */}
        {/* Add other links like Settings */}
         <NavLink to="/app/settings" className={linkClasses}> {/* Placeholder */}
            <FiSettings /> Settings
        </NavLink>
      </nav>
        {/* Logout Button at the bottom */}
        <div className="mt-auto pt-4 border-t">
             <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full py-2.5 px-4 rounded transition duration-200 text-text-secondary hover:bg-red-100 hover:text-red-700"
            >
                <FiLogOut /> Logout
            </button>
        </div>
    </aside>
  );
}

export default Sidebar;