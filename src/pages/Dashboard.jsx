import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiPlus, FiUpload } from 'react-icons/fi';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Mock data for the small chart
const chartData = [
  { name: 'Mon', emissions: 120 }, { name: 'Tue', emissions: 150 },
  { name: 'Wed', emissions: 100 }, { name: 'Thu', emissions: 180 },
  { name: 'Fri', emissions: 130 }, { name: 'Sat', emissions: 200 },
  { name: 'Sun', emissions: 170 },
];

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
  
  const recentActivities = [
    { icon: '🔬', text: 'New soil scan uploaded for Sunrise Meadows Farm.', time: '2 hours ago', color: 'bg-green-100 text-green-600' },
    { icon: '💡', text: 'AI recommended planting Corn in Field B-2.', time: 'Yesterday', color: 'bg-blue-100 text-blue-600' },
    { icon: '🏅', text: "You earned the 'Water Saver' badge!", time: '3 days ago', color: 'bg-yellow-100 text-yellow-600' },
    { icon: '🚜', text: 'Logged "Fertilizing" activity on Kianjogu Farm.', time: '4 days ago', color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">
                    Welcome back, {user?.full_name || 'Alex'}!
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Farms" value="12" trend="+2 this month" icon="🏞️" chartData={chartData} colorClass="bg-green-100 text-green-600" />
            <StatCard title="Weekly Emission" value="1.2M kg" trend="+12%" icon="💨" chartData={chartData.slice().reverse()} colorClass="bg-red-100 text-red-600" />
            <StatCard title="AI Crop Suggestions" value="5" trend="+1 new suggestion" icon="💡" chartData={chartData} colorClass="bg-blue-100 text-blue-600" />
            <StatCard title="Badges Earned" value="8" trend="+1 new badge" icon="🏅" chartData={chartData.slice().reverse()} colorClass="bg-yellow-100 text-yellow-600" />
        </div>

        <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Recent Activity</h2>
            <div className="bg-surface rounded-xl shadow-md p-6">
                <div className="space-y-2">
                    {recentActivities.map((activity, index) => (
                        <ActivityItem key={index} {...activity} />
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
  );
}

export default Dashboard;