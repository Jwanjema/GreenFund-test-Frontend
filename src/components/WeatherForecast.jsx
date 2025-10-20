import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

const getWeatherIcon = (code) => {
  if (code === 0) return '☀️';
  if (code >= 1 && code <= 3) return '⛅️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '🌍';
};

function WeatherForecast({ farm, onForecastLoaded }) {
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!farm || !farm.id) return;

    const fetchForecast = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiClient.get(`/climate/${farm.id}/forecast`);
        const forecastData = response.data.forecast.daily;
        const recommendations = response.data.recommendations;

        const processedForecast = forecastData.time.map((date, index) => ({
          // Using toLocaleDateString for consistency
          date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          weatherCode: forecastData.weathercode[index],
          maxTemp: Math.round(forecastData.temperature_2m_max[index]),
          minTemp: Math.round(forecastData.temperature_2m_min[index]),
          precipitation: forecastData.precipitation_sum[index],
        }));
        
        setForecast(processedForecast);
        
        if (onForecastLoaded) {
          onForecastLoaded(recommendations);
        }
      } catch (err) {
        setError('Could not load weather forecast. Please try again later.');
        console.error('Failed to fetch forecast:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecast();
  }, [farm, onForecastLoaded]);

  if (isLoading) {
    return <p className="text-text-secondary mt-8">Loading weather forecast...</p>;
  }
  
  if (error) {
    return <p className="text-red-500 mt-8">{error}</p>;
  }
  
  if (!forecast) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-text-primary mb-4">7-Day Weather Forecast</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {forecast.map((day) => (
          <div key={day.date} className="bg-background p-4 rounded-lg text-center">
            <p className="font-bold">{day.date}</p>
            <p className="text-4xl my-2">{getWeatherIcon(day.weatherCode)}</p>
            <p className="font-semibold">{day.maxTemp}° / {day.minTemp}°</p>
            <p className="text-sm text-text-secondary mt-1">{day.precipitation} mm</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherForecast;