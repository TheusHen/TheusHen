import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Home from '../Home/Home'; // Importa a Home page após o carregamento
import './Boot.css';

const Boot = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Finaliza o carregamento após 1,5 segundos
    }, 1500);

    return () => clearTimeout(timer); // Limpeza do timer quando o componente desmonta
  }, []);

  if (!isLoading) {
    return <Home />; // Redireciona para a Home quando o carregamento termina
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>I&apos;m Matheus</h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
        style={styles.subtitle}
      >
        SayesCode
      </motion.p>

      {/* Adiciona o status online com a bolinha verde */}
      <div style={styles.statusContainer}>
        <span style={styles.statusDot}></span>
        <span style={styles.statusText}>Status: Online</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  title: {
    fontFamily: "'Konkhmer Sleokchher', sans-serif",
    fontSize: '3rem',
    margin: 0,
    color: '#fff', // Definindo a cor do título como branco
  },
  subtitle: {
    fontFamily: "'Kodchasan', sans-serif",
    fontSize: '1.5rem',
    margin: 0,
    color: '#fff', // Definindo a cor do subtítulo como branco
  },
  // Estilos para o status
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '1rem',
  },
  statusDot: {
    height: '10px',
    width: '10px',
    backgroundColor: '#00FF00', // Cor verde para a bolinha
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '0.5rem',
  },
  statusText: {
    color: '#fff', // Cor branca para o texto do status
    fontFamily: "'Kodchasan', sans-serif",
    fontSize: '1rem',
  },
};

export default Boot;
