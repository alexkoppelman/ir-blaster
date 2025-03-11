import React from 'react';
import TemperatureChart from './TemperatureChart';
import MqttComponent from './MqttComponent';
import WeatherComponent from './WeatherComponent';

const App = () => {
  return (
    <div className='app'>
      <div className='app_header'>  <h1 className='doto-header'>Hostafrancs IR</h1><div className='app_currentTemp'><WeatherComponent /></div></div>
      <div className='app_contents'>
      <div className='app_contents_chart'>
      <TemperatureChart />
      </div>
      
      <div className='app_contents_mqtt'>
      <MqttComponent />
      </div>
      
      
      </div>
      
      
      <div className='app_footer'><h5>another one of those <a href="https://alexkoppelman.es" target="_blank" rel='noreferrer'>alex.k</a> inventions</h5></div>
    </div>
  );
};

export default App;