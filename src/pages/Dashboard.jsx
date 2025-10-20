import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';
import FarmFormModal from '../components/FarmFormModal';

function Dashboard() {
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(''); // Added error state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFarms = async () => {
      setIsLoading(true); // Set loading true at the start
      setError(''); // Clear previous errors
      try {
        const response = await apiClient.get('/farms/'); // Fetch from /api/farms/
        setFarms(response.data);
      } catch (error) {
        console.error("Failed to fetch farms:", error);
        setError('Could not load your farms. Please try again later.'); // Set error message
        setFarms([]); // Ensure farms is an array even on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchFarms();
  }, []);

  const handleFarmSaved = (savedFarm) => {
    setFarms(prevFarms => {
        const existingIndex = prevFarms.findIndex(farm => farm.id === savedFarm.id);
        if (existingIndex !== -1) {
            // Update existing farm
            const updatedFarms = [...prevFarms];
            updatedFarms[existingIndex] = savedFarm;
            return updatedFarms;
        } else {
            // Add new farm
            return Array.isArray(prevFarms) ? [...prevFarms, savedFarm] : [savedFarm];
        }
    });
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">
          Welcome, {user?.full_name || 'Farmer'}! {/* Added fallback name */}
        </h1>
        <div className="flex gap-4">

          {/* --- FIX #1: Added /app prefix --- */}
          <Link
            to="/app/soil-analysis" // Changed from "/soil-analysis"
            className="bg-accent text-white py-2 px-4 rounded hover:bg-orange-600 transition flex items-center gap-2" // Used accent color
          >
            🔬 Analyze Soil
          </Link>
          {/* --- End Fix --- */}

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white py-2 px-4 rounded hover:bg-green-700 transition flex items-center gap-2"
          >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg> Add New Farm
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">My Farms</h2> {/* Added margin-bottom */}
        {isLoading ? (
          <p className="mt-4 text-text-secondary">Loading farms...</p>
        ) : error ? ( // Display error if fetch failed
            <p className="mt-4 text-red-500 bg-red-100 p-4 rounded">{error}</p>
        ) : farms && farms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {farms.map((farm) => (
              // --- FIX #2: Added /app prefix ---
              <Link to={`/app/farms/${farm.id}`} key={farm.id}> {/* Changed from /farms/ */}
              {/* --- End Fix --- */}
                <div className="bg-surface p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between"> {/* Added h-full for alignment */}
                  <div>
                      <h3 className="font-bold text-lg text-primary mb-1">{farm.name}</h3>
                      <p className="text-text-secondary text-sm">{farm.location_text}</p>
                      <p className="text-sm mt-2 text-gray-500">{farm.size_acres} acres</p>
                  </div>
                  <span className="mt-4 text-primary font-semibold self-start">View Details →</span> {/* Adjusted link styling */}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-4 p-6 bg-surface rounded-lg shadow-md text-center">
            <p className="text-text-secondary mb-4">You haven't added any farms yet.</p> {/* Added margin-bottom */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-white py-2 px-4 rounded hover:bg-green-700 transition flex items-center gap-2 mx-auto" // Centered button
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg> Add Your First Farm
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <FarmFormModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleFarmSaved}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;