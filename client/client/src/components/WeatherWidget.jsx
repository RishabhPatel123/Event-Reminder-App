import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const city = 'Lucknow'; 
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

      if (!apiKey) {
        setError('Weather API key not found.');
        return;
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      try {
        const response = await axios.get(url);
        setWeather(response.data);
      } catch (err) {
        setError('Could not fetch weather.');
        console.error(err);
      }
    };

    fetchWeather();
  }, []);

  if (error) return <div>{error}</div>;
  if (!weather) return <div>Loading weather...</div>;

  return (
    <div>
      <h4>Weather in {weather.name}</h4>
      <p>{Math.round(weather.main.temp)}°C</p>
      <p>{weather.weather[0].description}</p>
    </div>
  );
};

export default WeatherWidget;