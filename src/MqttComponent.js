import React, { useEffect, useState, useRef } from 'react';
import mqtt from 'mqtt';
import mqttConfig from './config';

const MqttComponent = () => {
  const [messages, setMessages] = useState([]);
  
  const clientRef = useRef(null);

  useEffect(() => {
    const client = mqtt.connect(mqttConfig.server, {
      username: mqttConfig.username,
      password: mqttConfig.password,
      keepalive: mqttConfig.keepalive,
      clean: mqttConfig.clean,
      clientId: mqttConfig.clientId,
    });

    clientRef.current = client;

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('hostafrancs/status');
    });

    client.on('message', (topic, message) => {
      
      var today = new Date();
      var h = today.getHours();
      var m = today.getMinutes();

      var newMessage = h + ':' + m + ' - ' + message.toString();
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
    });

    client.on('error', (error) => {
      console.error('Connection error:', error);
    });

    client.on('reconnect', () => {
      console.log('Reconnecting to MQTT broker...');
    });

    return () => {
      client.end();
    };
  }, []);

  const sendMessage = (msg) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish('hostafrancs/0/irblaster', msg);
      
    } else {
      console.error('Client not connected');
    }
  };

  const handleConfirmSendMessage = (msg) => {
    if (window.confirm('Are you sure?')) {
      sendMessage(msg);
    }
  };

  return (
    <div>
      
      <textarea value={messages.join('\n')} readOnly rows={5} cols={50} className='app_texarea'/>
      <div className='buttonarea'>
        <button onClick={() => sendMessage('6')} className="button-84">Temperature Up</button><br/>
        <button onClick={() => sendMessage('5')} className="button-84">Temperature Down</button><br/>
        <button onClick={() => handleConfirmSendMessage('4')} className="button-84">Switch On/Off</button><br/>
      </div>
    </div>
  );
};

export default MqttComponent;