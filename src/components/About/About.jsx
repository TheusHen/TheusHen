import React, { useState } from 'react';
import { Undo2, ChevronDown, ChevronUp } from 'lucide-react';
import './About.css';
import Skills from '../Skills/Skills';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const [showSkills, setShowSkills] = useState(false);
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate("/");
  };

  const toggleSection = () => {
    setShowSkills(!showSkills);
  };

  return (
    <>
      {/* Seção About */}
      <div className={`about-container ${showSkills ? 'hidden' : 'visible'}`}>
        <div className="back-icon" onClick={handleBackClick}>
          <Undo2 size={32} />
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

      {/* Seção Skills */}
      <div className={`skills-container ${showSkills ? 'active' : 'hidden'}`}>
        <Skills />
      </div>

      {/* Botão para alternar entre About e Skills */}
      <div className="toggle-icon" onClick={toggleSection}>
        {showSkills ? (
          <ChevronUp size={32} />
        ) : (
          <ChevronDown size={32} />
        )}
      </div>
    </>
  );
};

export default About;
