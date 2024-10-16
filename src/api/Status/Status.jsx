import React, { useEffect, useState } from 'react';
import './Status.css'; // Importando o arquivo CSS para estilo

const Status = () => {
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');
  const [effectiveType, setEffectiveType] = useState('unknown');
  const [downlink, setDownlink] = useState('N/A');
  const [rtt, setRtt] = useState('N/A');

  const updateNetworkStatus = () => {
    setOnlineStatus(navigator.onLine);
    if (navigator.connection) {
      setConnectionType(navigator.connection.type || 'unknown');
      setEffectiveType(navigator.connection.effectiveType || 'unknown');
      setDownlink(navigator.connection.downlink ? `${navigator.connection.downlink.toFixed(2)} Mbps` : 'N/A');
      setRtt(navigator.connection.rtt ? `${navigator.connection.rtt} ms` : 'N/A');
    } else {
      // Caso navigator.connection não esteja disponível
      setConnectionType('unknown');
      setEffectiveType('unknown');
      setDownlink('N/A');
      setRtt('N/A');
    }
  };

  useEffect(() => {
    updateNetworkStatus();

    const handleOnline = () => updateNetworkStatus();
    const handleOffline = () => updateNetworkStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Adiciona o listener para mudanças de conexão se navigator.connection estiver disponível
    if (navigator.connection) {
      navigator.connection.addEventListener('change', updateNetworkStatus);
    }

    // Atualiza o status a cada 5 segundos
    const intervalId = setInterval(updateNetworkStatus, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', updateNetworkStatus);
      }
      clearInterval(intervalId); // Limpa o temporizador
    };
  }, []);

  return (
    <div className="status-container">
      <h2>Network Status</h2>
      <p>Status: <span className={onlineStatus ? 'online' : 'offline'}>{onlineStatus ? 'Online' : 'Offline'}</span></p>
      <p>Connection Type: {connectionType}</p>
      <p>Effective Type: {effectiveType}</p>
      <p>Download Speed: {downlink}</p>
      <p>Ping (RTT): {rtt}</p>
    </div>
  );
};

export default Status;
