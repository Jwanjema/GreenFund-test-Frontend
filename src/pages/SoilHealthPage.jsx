import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api';
import SoilReport from '../components/SoilReport'; // Reuse the component we already built

function SoilHealthPage() {
  const { id } = useParams(); // Get farm ID from URL
  const [farm, setFarm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch basic farm info (like name) for context
  useEffect(() => {
    const fetchFarm = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/farms/${id}`);
        setFarm(response.data);
      } catch (error) {
        console.error("Failed to fetch farm details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFarm();
  }, [id]);

  if (isLoading) {
    return <p>Loading farm data...</p>;
  }

  if (!farm) {
    return <p>Farm not found.</p>;
  }

  return (
    <div>
      {/* Link back to the main farm detail page */}
      <Link to={`/farms/${id}`} className="text-primary hover:underline mb-6 block">
        &larr; Back to {farm.name} Overview
      </Link>

      <div className="bg-surface p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Soil Health Analysis for {farm.name}
        </h1>
        {/* Render the SoilReport component */}
        <SoilReport farm={farm} />
      </div>
    </div>
  );
}

export default SoilHealthPage;