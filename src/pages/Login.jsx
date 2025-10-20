import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Create the form data body required by the backend
      const formBody = new URLSearchParams();
      formBody.append('username', formData.username);
      formBody.append('password', formData.password);

      // Post the login request
      const response = await apiClient.post('/auth/login', formBody, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      
      const { access_token } = response.data;
      
      // **THE FIX**: Manually provide the new token for this specific call.
      // This is necessary because the token hasn't been saved to localStorage yet
      // for the automatic interceptor to use.
      const userResponse = await apiClient.get('/users/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // Now, update the global auth state, which saves the token for all future requests
      login(access_token, userResponse.data);
      
      // Navigate to the main dashboard
      navigate('/');
      
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during login.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full bg-surface p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
          Login to GreenFund
        </h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <div className="mb-4">
            <label className="block text-text-secondary mb-2" htmlFor="username">Email</label>
            <input
              type="email"
              name="username" // Must be 'username' for the backend
              id="username"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-text-secondary mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-text-secondary mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;