// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

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
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<PublicLayout />}>
          {/* ... landing, login, register */}
           <Route index element={token ? <Navigate to="/app" /> : <LandingPage />} />
           <Route path="login" element={token ? <Navigate to="/app" /> : <Login />} />
           <Route path="register" element={token ? <Navigate to="/app" /> : <Register />} />
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
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="farms/:id" element={<FarmDetail />} />
          <Route path="farms/:id/soil" element={<SoilHealthPage />} />
          <Route path="soil-analysis" element={<SoilFarmSelection />} />
          {/* --- NEW: Forum Routes --- */}
          <Route path="forum" element={<ForumListPage />} />
          <Route path="forum/threads/:threadId" element={<ForumThreadPage />} /> {/* Route for single thread */}
          {/* --- End New --- */}
        </Route>

      </Routes>
    </Router>
  );
}

export default App;