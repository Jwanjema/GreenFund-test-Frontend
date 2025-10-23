// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AnimatePresence } from 'framer-motion';

import AppLayout from './components/AppLayout';
import PublicLayout from './components/PublicLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyFarmsPage from './pages/MyFarmsPage';
import FarmDetail from './pages/FarmDetail';
import SoilHealthPage from './pages/SoilHealthPage';
import SoilFarmSelection from './pages/SoilFarmSelection';
import ForumListPage from './pages/ForumListPage';
import ForumThreadPage from './pages/ForumThreadPage';
import ChatbotPage from './pages/ChatbotPage';
import SettingsPage from './pages/SettingsPage'; // <-- 1. Import SettingsPage

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
    const { token } = useAuth();
    return token ? <Navigate to="/app/dashboard" replace /> : children;
}

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
          </Route>

          {/* Protected Routes */}
          <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="my-farms" element={<MyFarmsPage />} />
            <Route path="farms/:id" element={<FarmDetail />} />
            <Route path="soil-analysis" element={<SoilFarmSelection />} />
            <Route path="farms/:id/soil" element={<SoilHealthPage />} />
            <Route path="forum" element={<ForumListPage />} />
            <Route path="forum/threads/:threadId" element={<ForumThreadPage />} />
            <Route path="chatbot" element={<ChatbotPage />} />
            <Route path="settings" element={<SettingsPage />} /> {/* <-- 2. Add route for settings */}
            <Route path="*" element={<Navigate to="dashboard" replace />} /> {/* Catch-all *within* /app */}
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} /> {/* Overall catch-all */}
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;