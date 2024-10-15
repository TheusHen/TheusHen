import React from 'react';
import './Contact.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';

const Contact = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="contact-container">
            <h1 className="contact-title">Contact</h1>
            <div className="icons-container">
                <a href="https://github.com/SayesCode" target="_blank" rel="noopener noreferrer" className="icon-link">
                    <FontAwesomeIcon icon={faGithub} size="2x" />
                </a>
                <a href="https://discord.com/users/_sayes" target="_blank" rel="noopener noreferrer" className="icon-link">
                    <FontAwesomeIcon icon={faDiscord} size="2x" />
                </a>
            </div>
            <button className="back-button" onClick={handleBack}>Back</button>
        </div>
    );
};

export default Contact;
