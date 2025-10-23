import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiPlus, FiUpload } from 'react-icons/fi';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import apiClient from '../services/api'; // 1. Import the API client

// --- Mock data for charts (will still be used for now) ---
const chartData = [
  { name: 'Mon', emissions: 120 }, { name: 'Tue', emissions: 150 },
  { name: 'Wed', emissions: 100 }, { name: 'Thu', emissions: 180 },
  { name: 'Fri', emissions: 130 }, { name: 'Sat', emissions: 200 },
  { name: 'Sun', emissions: 170 },
];
// ----------------------------------------------------

// Reusable Stat Card Component (No changes)
const StatCard = ({ title, value, trend, icon, chartData, colorClass }) => (
    <div className="bg-surface p-6 rounded-xl shadow-md flex flex-col">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm text-text-secondary font-medium">{title}</p>
                <p className="text-3xl font-bold text-text-primary">{value}</p>
                <p className={`text-xs font-semibold ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</p>
            </div>
            <div className={`text-2xl p-3 rounded-full ${colorClass}`}>{icon}</div>
        </div>
        <div className="h-16 w-full mt-auto">
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -40, bottom: 5 }}>
                    <Line type="monotone" dataKey="emissions" stroke={colorClass.includes('green') ? '#22c55e' : '#3b82f6'} strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

// Reusable Activity Item Component (No changes)
const ActivityItem = ({ icon, text, time, color }) => (
    <div className="flex items-center gap-4 py-3 border-b last:border-b-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-text-primary">{text}</p>
            <p className="text-xs text-text-secondary">{time}</p>
        </div>
    </div>
);

function Dashboard() {
  const { user } = useAuth();
  
  // 2. Add state to hold our dynamic data
  const [totalFarms, setTotalFarms] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Fetch data from the backend when the page loads
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all the user's farms
        const farmsResponse = await apiClient.get('/farms/');
        setTotalFarms(farmsResponse.data.length);

        // Fetch recent activity
        // This is a placeholder: it just gets activity from the *first* farm
        // A real implementation would need a new backend endpoint like /api/activities/recent
        if (farmsResponse.data.length > 0) {
          const firstFarmId = farmsResponse.data[0].id;
          const activityResponse = await apiClient.get(`/activities/farm/${firstFarmId}`);
          // Get the top 3 activities
          setRecentActivities(activityResponse.data.slice(0, 3));
        }
        
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // The empty array [] means this runs once when the component mounts


  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">
                    Welcome back, {user?.full_name || 'Farmer'}!
                </h1>
                <p className="text-text-secondary mt-1">Here is a summary of your farms' activity.</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
                <Link to="/app/my-farms" className="bg-primary text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-700 transition">
                    <FiPlus /> Add/View Farms
                </Link>
                <Link to="/app/soil-analysis" className="bg-secondary text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                    <FiUpload /> Upload Soil Data
                </Link>
            </div>
        </div>

        {/* 4. Update Stat Cards to use real data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Farms" 
              value={isLoading ? '...' : totalFarms} 
              trend={totalFarms > 0 ? `Tracking ${totalFarms} properties` : "No farms added"} 
              icon="🏞️" 
              chartData={chartData} 
              colorClass="bg-green-100 text-green-600" 
            />
            {/* These cards are still using mock data. We'll need new backend endpoints to make them real. */}
            <StatCard title="Weekly Emission" value="1.2M kg" trend="+12%" icon="💨" chartData={chartData.slice().reverse()} colorClass="bg-red-100 text-red-600" />
            <StatCard title="AI Crop Suggestions" value="5" trend="+1 new suggestion" icon="💡" chartData={chartData} colorClass="bg-blue-100 text-blue-600" />
            <StatCard title="Badges Earned" value="8" trend="+1 new badge" icon="🏅" chartData={chartData.slice().reverse()} colorClass="bg-yellow-100 text-yellow-600" />
        </div>

        {/* 5. Update Recent Activity to use real data */}
        <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Recent Activity</h2>
            <div className="bg-surface rounded-xl shadow-md p-6">
                <div className="space-y-2">
                    {isLoading ? (
                      <p>Loading activities...</p>
                    ) : recentActivities.length > 0 ? (
                      recentActivities.map((activity) => (
                        <ActivityItem 
                          key={activity.id} 
                          icon="🚜" 
                          text={activity.description || activity.activity_type} 
                          time={new Date(activity.date).toLocaleDateString()} 
                          color="bg-orange-100 text-orange-600"
                        />
                      ))
                    ) : (
                      <p>No recent activity found.</p>
                    )}
                </div>
            </div>
        </div>
    </motion.div>
  );
}

export default Dashboard;