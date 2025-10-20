// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AnimatePresence } from 'framer-motion'; // Ensure this is imported if using animations

import AppLayout from './components/AppLayout';
import PublicLayout from './components/PublicLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FarmDetail from './pages/FarmDetail';
import SoilHealthPage from './pages/SoilHealthPage';
import SoilFarmSelection from './pages/SoilFarmSelection';
// --- NEW: Import Forum Pages ---
import ForumListPage from './pages/ForumListPage';
import ForumThreadPage from './pages/ForumThreadPage';
// --- End New ---


function ProtectedRoute({ children }) {
  const { token } = useAuth();
  // If no token, redirect to login, preserving the intended location
  return token ? children : <Navigate to="/login" replace />;
}

// Optional: Component to handle redirects for logged-in users on public pages
function PublicRoute({ children }) {
    const { token } = useAuth();
    return token ? <Navigate to="/app/dashboard" replace /> : children;
}


function App() {
  // No need for token here if using ProtectedRoute/PublicRoute correctly

  return (
    <Router>
      <AnimatePresence mode="wait"> {/* Optional: For page transition animations */}
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
          </Route>

          {/* --- PROTECTED ROUTES --- */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Redirect /app to /app/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="farms/:id" element={<FarmDetail />} />
            <Route path="farms/:id/soil" element={<SoilHealthPage />} />
            <Route path="soil-analysis" element={<SoilFarmSelection />} />
            {/* --- NEW: Forum Routes --- */}
            <Route path="forum" element={<ForumListPage />} />
            <Route path="forum/threads/:threadId" element={<ForumThreadPage />} /> {/* Route for single thread */}
            {/* --- End New --- */}

            {/* Optional: Catch-all for unknown routes within /app */}
             <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Optional: Catch-all for unknown top-level routes */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;