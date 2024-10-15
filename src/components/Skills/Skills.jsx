import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import "./Skills.css";

const SkillsCarousel = () => {
  const navigate = useNavigate(); // Usando useNavigate
  const [scrollX, setScrollX] = useState(0);

  const handleBack = () => {
    navigate("/"); // Usando navigate em vez de router.push
  };

  const handleScrollLeft = () => {
    setScrollX(scrollX + 200);
  };

  const handleScrollRight = () => {
    setScrollX(scrollX - 200);
  };

  return (
    <div className="skills-carousel">
      <h2>Skills</h2>
      <div className="carousel-container">
        <button className="scroll-button left" onClick={handleScrollLeft}>
          {"<"}
        </button>
        <div className="carousel" style={{ transform: `translateX(${scrollX}px)` }}>
          <img src="https://skillicons.dev/icons?i=git" alt="Git" />
          <img src="https://skillicons.dev/icons?i=docker" alt="Docker" />
          <img src="https://skillicons.dev/icons?i=anaconda" alt="Anaconda" />
          <img src="https://skillicons.dev/icons?i=androidstudio" alt="Android Studio" />
          <img src="https://skillicons.dev/icons?i=arch" alt="Arch Linux" />
          <img src="https://skillicons.dev/icons?i=arduino" alt="Arduino" />
          <img src="https://skillicons.dev/icons?i=aws" alt="AWS" />
          <img src="https://skillicons.dev/icons?i=bash" alt="Bash" />
          <img src="https://skillicons.dev/icons?i=bootstrap" alt="Bootstrap" />
          <img src="https://skillicons.dev/icons?i=c" alt="C" />
          <img src="https://skillicons.dev/icons?i=cpp" alt="C++" />
          <img src="https://skillicons.dev/icons?i=cloudflare" alt="Cloudflare" />
          <img src="https://skillicons.dev/icons?i=cmake" alt="CMake" />
          <img src="https://skillicons.dev/icons?i=css" alt="CSS" />
          <img src="https://skillicons.dev/icons?i=dart" alt="Dart" />
          <img src="https://skillicons.dev/icons?i=electron" alt="Electron" />
          <img src="https://skillicons.dev/icons?i=express" alt="Express" />
          <img src="https://skillicons.dev/icons?i=fastapi" alt="FastAPI" />
          <img src="https://skillicons.dev/icons?i=flask" alt="Flask" />
          <img src="https://skillicons.dev/icons?i=flutter" alt="Flutter" />
          <img src="https://skillicons.dev/icons?i=github" alt="GitHub" />
          <img src="https://skillicons.dev/icons?i=gitlab" alt="GitLab" />
          <img src="https://skillicons.dev/icons?i=go" alt="Go" />
          <img src="https://skillicons.dev/icons?i=grafana" alt="Grafana" />
          <img src="https://skillicons.dev/icons?i=html" alt="HTML" />
          <img src="https://skillicons.dev/icons?i=js" alt="JavaScript" />
          <img src="https://skillicons.dev/icons?i=kali" alt="Kali Linux" />
          <img src="https://skillicons.dev/icons?i=kotlin" alt="Kotlin" />
          <img src="https://skillicons.dev/icons?i=linux" alt="Linux" />
          <img src="https://skillicons.dev/icons?i=md" alt="Markdown" />
          <img src="https://skillicons.dev/icons?i=mongodb" alt="MongoDB" />
          <img src="https://skillicons.dev/icons?i=nextjs" alt="Next.js" />
          <img src="https://skillicons.dev/icons?i=netlify" alt="Netlify" />
          <img src="https://skillicons.dev/icons?i=nginx" alt="Nginx" />
          <img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js" />
          <img src="https://skillicons.dev/icons?i=npm" alt="npm" />
          <img src="https://skillicons.dev/icons?i=postgres" alt="PostgreSQL" />
          <img src="https://skillicons.dev/icons?i=prometheus" alt="Prometheus" />
          <img src="https://skillicons.dev/icons?i=py" alt="Python" />
          <img src="https://skillicons.dev/icons?i=react" alt="React" />
          <img src="https://skillicons.dev/icons?i=redis" alt="Redis" />
          <img src="https://skillicons.dev/icons?i=ruby" alt="Ruby" />
          <img src="https://skillicons.dev/icons?i=robloxstudio" alt="Roblox Studio" />
          <img src="https://skillicons.dev/icons?i=tensorflow" alt="TensorFlow" />
          <img src="https://skillicons.dev/icons?i=unity" alt="Unity" />
          <img src="https://skillicons.dev/icons?i=vercel" alt="Vercel" />
          <img src="https://skillicons.dev/icons?i=vite" alt="Vite" />
          <img src="https://skillicons.dev/icons?i=windows" alt="Windows" />
          <img src="https://skillicons.dev/icons?i=yarn" alt="Yarn" />
        </div>
        <button className="scroll-button right" onClick={handleScrollRight}>
          {">"}
        </button>
      </div>
      <button className="back-button" onClick={handleBack}>
        Back
      </button>
    </div>
  );
};

export default SkillsCarousel;
