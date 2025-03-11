import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherComponent = () => {
  const [temperature, setTemperature] = useState(null);
  const [time, setTime] = useState(null);
  const [temperatureColor, setTemperatureColor] = useState(null);
  useEffect(() => {
    axios.get('https://api.open-meteo.com/v1/forecast?latitude=41.737&longitude=1.2439&current=temperature_2m&timezone=Europe%2FBerlin&forecast_days=1')
      .then(response => {
        const data = response.data.current;
        const temp = data.temperature_2m;
        const time = new Date(data.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        setTemperature(temp);
        setTemperatureColor(temp);
        setTime(time);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }, []);

  return (
    <div>
      {time && temperature !== null ? (
        <div className='current_Outside'>
          <span className='time'> {time}</span><br/><span className='temp' style={{color: temperature <  15 ? "#009FFD" : "#FFA400"}} > {temperature}°c</span>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WeatherComponent;