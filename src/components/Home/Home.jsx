import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>I&apos;m Matheus</h1>
      <p style={styles.subtitle}>SayesCode</p>
      <div style={styles.imageContainer}>
        <div
          style={styles.card}
          onClick={() => navigate('/projects')}
        >
          <img src="../../assets/landscapes/projects.webp" alt="Projects" style={styles.image} />
        </div>
        <div
          style={styles.card}
          onClick={() => navigate('/skills')}
        >
          <img src="../../assets/landscapes/skills.webp" alt="Skills" style={styles.image} />
        </div>
        <div
          style={styles.card}
          onClick={() => navigate('/contact')}
        >
          <img src="../../assets/landscapes/contact.webp" alt="Contact" style={styles.image} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Título e subtítulo para cima
    height: '100vh',
    width: '100vw',
    backgroundColor: '#121212',
    color: '#fff',
    margin: 0,
    paddingTop: '5rem', // Distância do topo
  },
  title: {
    fontFamily: "'Konkhmer Sleokchher', sans-serif",
    fontSize: '4rem', // Tamanho aumentado do título
    marginBottom: '1rem',
    color: '#fff',
  },
  subtitle: {
    fontFamily: "'Kodchasan', sans-serif",
    fontSize: '2rem', // Tamanho aumentado do subtítulo
    marginBottom: '3rem',
    color: '#fff',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '80%', // Aumentar largura da área de botões
  },
  card: {
    width: '200px', // Tamanho aumentado do card
    height: '300px', // Tamanho aumentado do card
    backgroundColor: '#ccc',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ajustar a imagem dentro do card
    borderRadius: '15px', // Manter bordas arredondadas nas imagens
  },
};

export default Home;
