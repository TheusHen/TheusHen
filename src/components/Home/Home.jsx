import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowDown, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import './Home.css'; // Estilos externos para manter a organização

const Home = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const handleHover = (direction) => setHovered(direction);
  const handleLeave = () => setHovered(null);

  return (
    <div className="container">
      <h1 className="title">I&apos;m Matheus</h1>
      <p className="subtitle">SayesCode</p>
      
      {/* Setas nas bordas */}
      <div
        className="arrow arrow-left"
        onMouseEnter={() => handleHover('projects')}
        onMouseLeave={handleLeave}
        onClick={() => navigate('/projects')}
      >
        <FaArrowLeft className="icon" />
        {hovered === 'projects' && <span className="tooltip">Projects</span>}
      </div>

      <div
        className="arrow arrow-bottom"
        onMouseEnter={() => handleHover('about')}
        onMouseLeave={handleLeave}
        onClick={() => navigate('/about')}
      >
        <FaArrowDown className="icon" />
        {hovered === 'about' && <span className="tooltip">About</span>}
      </div>

      <div
        className="arrow arrow-right"
        onMouseEnter={() => handleHover('contact')}
        onMouseLeave={handleLeave}
        onClick={() => navigate('/contact')}
      >
        <FaArrowRight className="icon" />
        {hovered === 'contact' && <span className="tooltip">Contact</span>}
      </div>
    </div>
  );
};

export default Home;
