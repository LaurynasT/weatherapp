import  { useState, useEffect } from "react";
import Search from "./components/Search";
import { WeatherData } from "./components/Search";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiSquareRemove } from "react-icons/ci";

function App() {
  const [savedForecasts, setSavedForecasts] = useState<WeatherData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const forecastsPerPage = 10;

  useEffect(() => {
    const saved = localStorage.getItem("forecasts");
    if (saved) {
      setSavedForecasts(JSON.parse(saved));
    }
  }, []);

  const handleSaveForecast = (forecast: WeatherData) => {
    try {
      const updatedForecasts = [...savedForecasts, forecast];
      setSavedForecasts(updatedForecasts);
      localStorage.setItem('forecasts', JSON.stringify(updatedForecasts));
      toast.success('Forecast saved successfully!');
    } catch (error) {
      toast.error('Error saving forecast. ');
    }
  };

  const handleRemoveForecast = (id: number) => {
    try{
    const updatedForecasts = savedForecasts.filter((forecast) => forecast.id !== id);
    setSavedForecasts(updatedForecasts);
    localStorage.setItem("forecasts", JSON.stringify(updatedForecasts));
    toast.success('Forecast removed successfully!');
    }
    catch{
      toast.error('Error deleting forecast.')
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filteredForecasts = savedForecasts.filter((forecast) =>
    forecast.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleModal = () => setIsModalOpen(!isModalOpen);

 
  const totalPages = Math.ceil(filteredForecasts.length / forecastsPerPage);
  const displayedForecasts = filteredForecasts.slice(
    (currentPage - 1) * forecastsPerPage,
    currentPage * forecastsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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

      
      {displayedForecasts.length === 0 ? (
        <p className="has-text-grey">No saved forecasts match your search.</p>
      ) : (
        <div>
          {displayedForecasts.map((forecast) => (
            <div key={forecast.id} className="box">
              <div className="columns is-vcentered is-size-4">
                <div className="column is-three-quarters">
                  <strong>
                    {forecast.name}, {forecast.sys.country}
                  </strong>{" "}
                  - {forecast.main.temp}°C, {forecast.main.humidity}%, {forecast.main.pressure} hPa,{" "}
                  {forecast.wind.speed} m/s, Sunrise: {formatTime(forecast.sys.sunrise)}, Sunset:{" "}
                  {formatTime(forecast.sys.sunset)}
                  
                  {forecast.weather[0] && (
                    <div>
                      <img
                        src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                        alt={forecast.weather[0].description}
                        title={forecast.weather[0].description}
                        style={{ verticalAlign: "middle", marginLeft: "10px" }}
                      />
                    </div>
                  )}
                </div>
                <div className="column">
                  <button
                  
                    
                    onClick={() => handleRemoveForecast(forecast.id)}
                  >
                    <CiSquareRemove style={{ fontSize: "2.5rem" }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      
      <nav className="pagination is-centered mt-4" role="navigation" aria-label="pagination">
        <button
          className="pagination-previous"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <button
          className="pagination-next"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
        <ul className="pagination-list">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index}>
              <button
                className={`pagination-link ${currentPage === index + 1 ? "is-current" : ""}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

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
       <ToastContainer
       position="bottom-center"
       closeOnClick
       toastStyle={{
        backgroundColor: '#333', 
        color: '#fff',         
        borderRadius: '8px',     
        padding: '8px 16px',    
        fontSize: '14px',
      }} />
    </div>
  );
}

export default App;
