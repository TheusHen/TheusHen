import React, { useState } from "react";
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Skills.css";

const Skills = () => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const skills = [
    "git", "docker", "anaconda", "androidstudio", "arch", "arduino", 
    "aws", "bash", "bootstrap", "c", "cpp", "cloudflare", "cmake", 
    "css", "dart", "electron", "express", "fastapi", "flask", "flutter", 
    "github", "gitlab", "go", "grafana", "html", "js", "kali", "kotlin", 
    "linux", "md", "mongodb", "nextjs", "netlify", "nginx", "nodejs", 
    "npm", "postgres", "prometheus", "py", "react", "redis", "ruby", 
    "robloxstudio", "tensorflow", "unity", "vercel", "vite", "windows", 
    "yarn"
  ];

  return (
    <div className="skills-page">
      <h2>Skills</h2>
      {!showAll ? (
        <Slider {...settings}>
          {skills.map((skill) => (
            <img 
              key={skill} 
              src={`https://skillicons.dev/icons?i=${skill}&theme=light`} 
              alt={skill} 
              loading="lazy"
            />
          ))}
        </Slider>
      ) : (
        <div className="skills-container active">
          {skills.map((skill) => (
            <div key={skill} className="skill-item">
              <img 
                src={`https://skillicons.dev/icons?i=${skill}&theme=light`} 
                alt={skill} 
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
        
      <div className="button-container">
        <button className="toggle-button" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Carousel" : "All Skills"}
        </button>
      </div>
    </div>
  );
};

export default Skills;
