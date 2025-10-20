import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../services/api';

function FarmFormModal({ onClose, onSave, existingFarm }) {
  const [formData, setFormData] = useState({
    name: '',
    location_text: '',
    size_acres: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingFarm) {
      setFormData({
        name: existingFarm.name,
        location_text: existingFarm.location_text,
        size_acres: existingFarm.size_acres,
      });
    }
  }, [existingFarm]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let response;
      if (existingFarm) {
        response = await apiClient.patch(`/farms/${existingFarm.id}`, formData);
      } else {
        response = await apiClient.post('/farms/', formData);
      }
      onSave(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save farm.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // --- THIS IS THE FIX ---
      // We are changing z-50 to z-[9999] to give it a very high z-index
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div className="bg-surface p-8 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6">{existingFarm ? 'Edit Farm' : 'Add a New Farm'}</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-text-secondary mb-1">Farm Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-text-secondary mb-1">Location 📍 (e.g., "Nakuru, Kenya")</label>
              <input type="text" name="location_text" value={formData.location_text} onChange={handleChange} required className="w-full p-2 border rounded" placeholder="Be as specific as possible" />
            </div>
            <div>
              <label className="block text-text-secondary mb-1">Size (in acres)</label>
              <input type="number" step="any" name="size_acres" value={formData.size_acres} onChange={handleChange} required className="w-full p-2 border rounded" />
            </div>
          </div>
          
          <div className="flex justify-end mt-6 gap-4">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="py-2 px-4 rounded bg-primary text-white hover:bg-green-700">
              Save Farm
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default FarmFormModal;