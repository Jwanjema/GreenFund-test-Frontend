import React from 'react';
import Layout from '../components/AppLayout'; // Correct path relative to src/pages/
import { FiUser, FiBell, FiLock } from 'react-icons/fi';

function SettingsPage() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold text-primary mb-6">Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Account Settings</h2>
        <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded">
          <FiUser className="text-primary" size={20} />
          <span className="text-text-secondary">Profile Information (Coming Soon)</span>
        </div>
        <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded">
          <FiLock className="text-primary" size={20} />
          <span className="text-text-secondary">Change Password (Coming Soon)</span>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 pt-4">Notifications</h2>
         <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded">
          <FiBell className="text-primary" size={20} />
          <span className="text-text-secondary">Notification Preferences (Coming Soon)</span>
        </div>
      </div>
    </Layout>
  );
}

export default SettingsPage;