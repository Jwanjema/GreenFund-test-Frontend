import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

function ActivityLog({ farm }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activityType, setActivityType] = useState('Planting');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!farm.id) return;
    
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/activities/farm/${farm.id}`);
        setActivities(response.data);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        setError("Could not load activities.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, [farm.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) {
      setError("Please add a description.");
      return;
    }
    setError('');

    try {
      const newActivityData = {
        farm_id: farm.id,
        activity_type: activityType,
        description: description,
        date: new Date().toISOString(),
      };
      
      const response = await apiClient.post('/activities/', newActivityData);
      
      setActivities([response.data, ...activities]);
      
      setDescription('');
      setActivityType('Planting');
      
    } catch (err) {
      console.error("Failed to add activity:", err);
      setError("Failed to save activity. Please try again.");
    }
  };
  
  const handleDelete = async (activityId) => {
    if (!window.confirm("Are you sure you want to delete this log entry?")) {
      return;
    }
    
    try {
      await apiClient.delete(`/activities/${activityId}`);
      setActivities(activities.filter(act => act.id !== activityId));
    } catch (err) {
      console.error("Failed to delete activity:", err);
      alert("Could not delete the entry. Please try again.");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Farm Activity Log</h2>
      
      <form onSubmit={handleSubmit} className="bg-background p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-2">Log a New Activity</h3>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Activity Type</label>
            <select 
              value={activityType} 
              onChange={(e) => setActivityType(e.target.value)} 
              className="w-full p-2 border rounded"
            >
              <option>Planting</option>
              <option>Irrigation</option>
              <option>Fertilizing</option>
              <option>Pest Control</option>
              <option>Harvesting</option>
              <option>Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Planted 2 acres of maize" 
              className="w-full p-2 border rounded" 
              required
            />
          </div>
        </div>
        <button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-green-700">
          Save Activity
        </button>
      </form>

      {/* List of Activities */}
      <div className="space-y-4">
        {isLoading ? (
          <p>Loading activities...</p>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="bg-background p-4 rounded-lg flex justify-between items-start">
              
              {/* --- THIS IS THE CHANGE --- */}
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-text-primary">{activity.activity_type}</p>
                  {/* We display the carbon footprint as a badge */}
                  <span className="text-xs font-medium bg-secondary text-white px-2 py-0.5 rounded-full">
                    {activity.carbon_footprint_kg} kg CO₂e
                  </span>
                </div>
                <p className="text-text-secondary mt-1">{activity.description}</p>
                <p className="text-xs text-text-secondary mt-1">
                  {new Date(activity.date).toLocaleString()}
                </p>
              </div>
              
              <button 
                onClick={() => handleDelete(activity.id)} 
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-text-secondary">No activities logged for this farm yet.</p>
        )}
      </div>
    </div>
  );
}

export default ActivityLog;