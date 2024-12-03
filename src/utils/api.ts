const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; 
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const buildWeatherUrl = (query: string): string => {
  if (/^\d{5}$/.test(query)) {
    return `${BASE_URL}?zip=${query}&appid=${API_KEY}&units=metric`;
  } else if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(query)) {
    const [lat, lon] = query.split(",");
    return `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  } else {
    return `${BASE_URL}?q=${query}&appid=${API_KEY}&units=metric`;
  }
};
