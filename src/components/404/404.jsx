import React from "react";
import "./404.css";

const NotFound = () => {
  return (
    <div className="container">
      <div className="error-message">
        <h1 className="error-text">404</h1>
        <p className="error-description">Not Found</p>
        <button className="home-button" onClick={() => window.location.href = "/"}>
          Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
