import React, { useState, useEffect } from 'react';
import { FiUser, FiBell, FiLock, FiSave, FiLoader } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext'; // Ensure this path is correct (e.g., ../contexts/AuthContext)
import api from '../services/api'; // Ensure this path is correct (e.g., ../services/api)
import toast from 'react-hot-toast';

function SettingsPage() {
  const { user, fetchUser } = useAuth(); // Assuming fetchUser updates the context
  const [loading, setLoading] = useState(false);
  
  // State for the form fields
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    location: '',
  });

  // When the component loads, fill the form with the current user's data
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        location: user.location || '',
      });
    }
  }, [user]); // Re-run if the user object changes

  // Handle changes to form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Filter out any fields that haven't changed
    const changes = {};
    if (formData.full_name !== user.full_name) changes.full_name = formData.full_name;
    if (formData.email !== user.email) changes.email = formData.email;
    // Check for null vs empty string difference for location
    if (formData.location !== (user.location || '')) changes.location = formData.location;


    if (Object.keys(changes).length === 0) {
      toast.error("No changes to save.");
      setLoading(false);
      return;
    }

    try {
      // Send PUT request to the new backend endpoint
      const response = await api.put('/users/me', changes);
      
      // Update the user context with the new data
      if (fetchUser) {
        fetchUser(); // This refetches the user and updates the context globally
      }
      
      toast.success("Profile updated successfully!");
      
      // Update form state in case fetchUser is async or not available
      setFormData({
        full_name: response.data.full_name || '',
        email: response.data.email || '',
        location: response.data.location || '',
      });

    } catch (err) {
      console.error("Failed to update profile:", err);
      // Display specific error from backend if available
      toast.error(err.response?.data?.detail || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };
  
  // Placeholder for password change
  const handlePasswordSubmit = (e) => {
      e.preventDefault();
      toast.error("Password change is not yet implemented.");
  };

  // Note: This component assumes it's rendered inside an AppLayout by the router
  // It does NOT include the <Layout> component itself
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Settings</h1>

      {/* --- Profile Information Form --- */}
      <form onSubmit={handleProfileSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Account Settings</h2>
        
        {/* Full Name */}
        <div className="flex items-center space-x-4 p-3">
          <FiUser className="text-primary" size={20} />
          <div className="flex-1">
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-500">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>
        
        {/* Email */}
        <div className="flex items-center space-x-4 p-3">
          <FiUser className="text-primary" size={20} /> {/* Consider using FiMail */}
          <div className="flex-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-500">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-4 p-3">
          <FiUser className="text-primary" size={20} /> {/* Consider using FiMapPin */}
          <div className="flex-1">
            <label htmlFor="location" className="block text-sm font-medium text-gray-500">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ''} // Ensure value is not null/undefined
              onChange={handleChange}
              placeholder="e.g., Nairobi, Kenya"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className={`bg-primary hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow flex items-center justify-center min-w-[120px] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? <FiLoader className="animate-spin" /> : <><FiSave className="mr-2" /> Save Changes</>}
          </button>
        </div>
      </form>
      
      {/* --- Password Change Form (Placeholder) --- */}
      <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Change Password</h2>
        <div className="flex items-center space-x-4 p-3">
          <FiLock className="text-primary" size={20} />
           <div className="flex-1">
            <label htmlFor="current_pass" className="block text-sm font-medium text-gray-500">Current Password</label>
            <input type="password" id="current_pass" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="************" />
          </div>
        </div>
         <div className="flex items-center space-x-4 p-3">
          <FiLock className="text-primary" size={20} />
           <div className="flex-1">
            {/* --- THIS IS THE FIX --- */}
            <label htmlFor="new_pass" className="block text-sm font-medium text-gray-500">New Password</label>
            {/* --- END FIX --- */}
            <input type="password" id="new_pass" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="************" />
          </div>
        </div>
         <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow flex items-center"
          >
            <FiSave className="mr-2" /> Change Password
          </button>
        </div>
      </form>

      {/* --- Notification Settings (Placeholder) --- */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Notifications</h2>
        <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded">
          <FiBell className="text-primary" size={20} />
          <span className="text-text-secondary">Notification Preferences (Coming Soon)</span>
        </div>
      </div>
      
    </div>
  );
}

export default SettingsPage;