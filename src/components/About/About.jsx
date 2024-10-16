import React from 'react';
import { Undo2 } from 'lucide-react';
import './About.css';
import Skills from '../Skills/Skills';
import { useNavigate } from 'react-router-dom';
const About = () => {
  const navigate = useNavigate();  // Hook para navegação

  const handleBackClick = () => {
    navigate("/");  // Navega para a página inicial
  };

  return (
    <>
      <div className="about-container">
        <div className="back-icon" onClick={handleBackClick}>
          <Undo2 size={32} /> {/* Ícone para voltar */}
        </div>
        <div className="about-content">
          <h1 className="title">I'm Matheus</h1>
          <h2 className="subtitle">SayesCode</h2>
          <p className="about-description">
            I'm a tech enthusiast who started coding at 9. Passionate about software development, I work with a variety of programming languages and tools such as Java, Python, JavaScript, Go, and more. I specialize in FullStack and DevOps, and have participated in tech competitions like the Brazilian Olympiad of Informatics (OBI) and various hackathons.
          </p>
        </div>
        <div className="about-image">
          <img src="../../../icon.png" alt="Matheus Henrique" />
        </div>
      </div>
      <div className="skills-container">
        <Skills />
      </div>
    </>
  );
};

export default About;
