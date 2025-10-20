// src/components/Sidebar.jsx (Example)
import React from 'react';
import { NavLink } from 'react-router-dom';
// ... other imports if needed

function Sidebar() {
  // ... other links ...

  return (
    <aside className="w-64 bg-surface text-text-primary p-4 shadow-lg"> {/* Added shadow */}
      <div className="mb-8 text-2xl font-bold text-primary text-center">
        🌿 GreenFund
      </div>
      <nav className="space-y-2">
        <NavLink
          to="/app/dashboard" // Ensure base path is correct
          className={({ isActive }) =>
            `block py-2.5 px-4 rounded transition duration-200 hover:bg-green-100 hover:text-primary ${
              isActive ? 'bg-green-200 text-primary font-semibold' : ''
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/app/soil-analysis" // Ensure base path is correct
           className={({ isActive }) =>
            `block py-2.5 px-4 rounded transition duration-200 hover:bg-green-100 hover:text-primary ${
              isActive ? 'bg-green-200 text-primary font-semibold' : ''
            }`
          }
        >
          Analyze Soil
        </NavLink>
        {/* --- NEW: Forum Link --- */}
        <NavLink
          to="/app/forum" // Link to the forum list page
           className={({ isActive }) =>
            `block py-2.5 px-4 rounded transition duration-200 hover:bg-green-100 hover:text-primary ${
              isActive ? 'bg-green-200 text-primary font-semibold' : ''
            }`
          }
        >
          Community Forum
        </NavLink>
         {/* --- End New --- */}
        {/* Add other links like Settings, Logout etc. */}
      </nav>
    </aside>
  );
}

export default Sidebar;