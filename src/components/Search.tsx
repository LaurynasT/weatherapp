import React, { useState } from "react";
import axios from "axios";
import 'bulma/css/bulma.css';
import { buildWeatherUrl } from "../utils/api";




export type WeatherData = {
  id: number;
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  main: { temp: number; humidity: number; pressure: number };
  wind: { speed: number };
  weather: { description: string; icon: string }[];

};

type SearchProps = {
  onSave: (forecast: WeatherData) => void;
  closeModal: () => void; 
};

const Search: React.FC<SearchProps> = ({ onSave, closeModal }) => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      if (!query) {
        setError("Please enter a search term.");
        return;
      }

      setError("");
      const url = buildWeatherUrl(query); 
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (err) {
      setError("Unable to fetch weather data. Please check your input or try again.");
    }
  };


  const handleSaveForecast = () => {
    if (weather) {
      onSave(weather);  
      closeModal();    
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="container">
      <section className="section">
        <div className="field has-addons">
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder="Enter city, ZIP, or coordinates (lat,lon)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="control">
            <button className="button is-primary" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        {error && <p className="help is-danger">{error}</p>}

        {weather && (
          <div className="box">
            <h2 className="title is-4">
              {weather.name}, {weather.sys.country}
            </h2>
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Pressure: {weather.main.pressure} hPa</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
            <p>Sunrise: {formatTime(weather.sys.sunrise)}</p>
            <p>Sunset: {formatTime(weather.sys.sunset)}</p>
            {weather.weather[0] && (
              <div className="has-text-centered">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  title={weather.weather[0].description}
                />
                <p>{weather.weather[0].description}</p>
              </div>
            )}

            <button className="button is-success mt-3" onClick={handleSaveForecast}>
              Save Forecast
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Search;
