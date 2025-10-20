import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import apiClient from '../services/api';
import FarmFormModal from '../components/FarmFormModal';
import WeatherForecast from '../components/WeatherForecast';
import FarmMap from '../components/FarmMap';
import ActivityLog from '../components/ActivityLog';
import CarbonDashboard from '../components/CarbonDashboard';
import { Tabs, TabPanel } from '../components/Tabs';

function FarmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(''); // Added error state

  useEffect(() => {
    const fetchFarm = async () => {
      setIsLoading(true);
      setError(''); // Clear previous errors
      try {
        // Fetch using the correct API endpoint, which includes /api/ implicitly
        const response = await apiClient.get(`/farms/${id}`);
        setFarm(response.data);
      } catch (error) {
        console.error("Failed to fetch farm details:", error);
        setError('Could not load farm details. Please try again or go back.'); // Set error message
        setFarm(null); // Clear farm data on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchFarm();
  }, [id]);

  const handleForecastLoaded = useCallback((recs) => {
    setRecommendations(recs);
  }, []);

  const handleUpdate = (updatedFarm) => {
    setFarm(updatedFarm);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this farm? This action cannot be undone.')) {
      try {
        await apiClient.delete(`/farms/${id}`);
        // --- FIX #1: Navigate back to the dashboard within the /app route ---
        navigate('/app/dashboard');
        // --- End Fix ---
      } catch (error) {
        console.error('Failed to delete farm:', error);
        alert('Could not delete the farm. Please try again.');
      }
    }
  };

  if (isLoading) return <p className="text-center mt-8">Loading farm details...</p>;
  if (error) return <p className="text-center mt-8 text-red-500 bg-red-100 p-4 rounded">{error}</p> // Show error message
  if (!farm) return <p className="text-center mt-8">Farm not found.</p>;

  return (
    <div>
      {/* --- FIX #2: Update back link to point to the dashboard within /app --- */}
      <Link to="/app/dashboard" className="text-primary hover:underline mb-6 block">&larr; Back to Dashboard</Link>
      {/* --- End Fix --- */}

      <div className="bg-surface p-6 md:p-8 rounded-lg shadow-md"> {/* Added padding responsiveness */}
        {/* --- Farm Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 pb-6 border-b"> {/* Added border */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">{farm.name}</h1>
            <p className="text-md md:text-lg text-text-secondary mt-1">{farm.location_text}</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0"> {/* Adjusted spacing for mobile */}
            <button onClick={() => setIsEditModalOpen(true)} className="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm"> {/* Reduced button size */}
              Edit
            </button>
            <button onClick={handleDelete} className="py-2 px-4 rounded bg-red-500 text-white hover:bg-red-600 text-sm"> {/* Reduced button size */}
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-semibold text-text-secondary text-sm">Size</p>
            <p className="text-text-primary">{farm.size_acres} acres</p>
          </div>
          <div>
            <p className="font-semibold text-text-secondary text-sm">Coordinates</p>
            <p className="text-text-primary text-sm">Lat: {farm.latitude?.toFixed(5)}, Long: {farm.longitude?.toFixed(5)}</p> {/* Added optional chaining and fixed precision */}
          </div>
        </div>

        {/* --- Button to link to Soil Health Page --- */}
        <div className="mb-8"> {/* Added margin-bottom */}
          {/* --- FIX #3: Add /app prefix to the soil link --- */}
          <Link
            to={`/app/farms/${id}/soil`}
            className="inline-flex items-center gap-2 bg-accent text-white py-2 px-4 rounded hover:bg-orange-600 transition" // Use accent color
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v10H5V5zm2 1a1 1 0 00-1 1v1h8V7a1 1 0 00-1-1H7zm0 4a1 1 0 00-1 1v1h8v-1a1 1 0 00-1-1H7z"/></svg> {/* Example icon */}
             View/Add Soil Data
          </Link>
          {/* --- End Fix --- */}
        </div>

        {/* --- Tabbed Interface --- */}
        <Tabs>
          <TabPanel label="Overview">
            <FarmMap farm={farm} />
            <WeatherForecast farm={farm} onForecastLoaded={handleForecastLoaded} />
            {recommendations.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-text-primary mb-3">💡 Recommendations</h2> {/* Adjusted heading size */}
                <ul className="list-disc list-inside space-y-2 bg-background p-4 rounded-lg text-sm"> {/* Adjusted font size */}
                  {recommendations.map((rec, index) => (
                    <li key={index} className="text-text-primary">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </TabPanel>

          <TabPanel label="Activity Log">
            <ActivityLog farm={farm} />
          </TabPanel>

          <TabPanel label="Carbon (CO₂e)">
            <CarbonDashboard farm={farm} />
          </TabPanel>

        </Tabs>

      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <FarmFormModal
            existingFarm={farm}
            onSave={handleUpdate}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default FarmDetail;