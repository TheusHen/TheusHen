import React, { useEffect, useState } from 'react';
import './Status.css'; // Importando o arquivo CSS para estilo

const Status = () => {
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('');
  const [effectiveType, setEffectiveType] = useState('');
  const [downlink, setDownlink] = useState('');
  const [rtt, setRtt] = useState('');

  const updateNetworkStatus = () => {
    setOnlineStatus(navigator.onLine);
    if (navigator.connection) {
      setConnectionType(navigator.connection.type || 'unknown');
      setEffectiveType(navigator.connection.effectiveType);
      setDownlink(navigator.connection.downlink);
      setRtt(navigator.connection.rtt);
    }
  };

  useEffect(() => {
    updateNetworkStatus();

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    navigator.connection.addEventListener('change', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return (
    <div className="status-container">
      <h2>Network Status</h2>
      <p>Status: <span className={onlineStatus ? 'online' : 'offline'}>{onlineStatus ? 'Online' : 'Offline'}</span></p>
      <p>Connection Type: {connectionType}</p>
      <p>Effective Type: {effectiveType}</p>
      <p>Download Speed (Mbps): {downlink}</p>
      <p>Ping (RTT ms): {rtt}</p>
    </div>
  );
};

export default Status;
