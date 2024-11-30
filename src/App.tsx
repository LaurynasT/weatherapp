import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import { WeatherData } from './components/Search'

function App() {
  const [savedForecasts, setSavedForecasts] = useState<WeatherData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("forecasts");
    if (saved) {
      setSavedForecasts(JSON.parse(saved));
    }
  }, []);

  const handleSaveForecast = (forecast: WeatherData) => {
    // Convert sunrise and sunset timestamps to local time strings
    const updatedForecasts = [...savedForecasts, forecast];
    setSavedForecasts(updatedForecasts);
    localStorage.setItem("forecasts", JSON.stringify(updatedForecasts));
  };

  const handleRemoveForecast = (id: number) => {
    const updatedForecasts = savedForecasts.filter((forecast) => forecast.id !== id);
    setSavedForecasts(updatedForecasts);
    localStorage.setItem("forecasts", JSON.stringify(updatedForecasts));
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filteredForecasts = savedForecasts.filter((forecast) =>
    forecast.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="has-text-primary is-size-1 has-text-centered has-text-weight-normal">
      <h1>Weather Search</h1>

      <div className="field has-addons">
        <div className="control is-expanded">
          <input
            className="input"
            type="text"
            placeholder="Search through saved forecasts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredForecasts.length === 0 ? (
        <p className="has-text-grey">No saved forecasts match your search.</p>
      ) : (
        <div>
          {filteredForecasts.map((forecast) => (
            <div key={forecast.id} className="box">
              <div className="columns is-vcentered">
                <div className="column is-three-quarters">
                  <strong>
                    {forecast.name}, {forecast.sys.country}
                  </strong>{" "}
                  - {forecast.main.temp}°C, {forecast.main.humidity}%, {forecast.main.pressure}hpa, {forecast.wind.speed}m/s, {formatTime(forecast.sys.sunrise)}, {formatTime(forecast.sys.sunset)}
                </div>
                <div className="column">
                  <button
                    className="button is-danger is-small"
                    onClick={() => handleRemoveForecast(forecast.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="button is-primary mt-4" onClick={toggleModal}>
        Add New Forecast
      </button>

      {isModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={toggleModal}></div>
          <div className="modal-content">
            <Search onSave={handleSaveForecast} closeModal={toggleModal} />
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={toggleModal}></button>
        </div>
      )}
    </div>
  );
}

export default App;
