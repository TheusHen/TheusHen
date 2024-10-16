import React from 'react';
import { Undo2 } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import GitHubRepos from "../../api/Github/Github";
import "./Projects.css";

const Projects = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <>
      <div className="back-icon" onClick={handleBackClick}>
        <Undo2 size={32} />
      </div>
      <GitHubRepos />
    </>
  );
};

export default Projects;
