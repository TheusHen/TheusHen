import React from 'react';
import { Mail, Undo2 } from 'lucide-react';
import './Contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';  // Para navegação

const Contact = () => {
    const navigate = useNavigate();  // Hook para navegação

    const handleBackClick = () => {
        navigate("/");  // Navega para a página inicial
    };

    return (
        <div className="contact-container">
            <div className="back-icon" onClick={handleBackClick}>
                <Undo2 size={32} /> {/* Ícone para voltar */}
            </div>
            <div className="contact-card">
                <a href="https://github.com/SayesCode" target="_blank" rel="noopener noreferrer" className="icon-link">
                    <FontAwesomeIcon icon={faGithub} size="3x" />
                    <span className="icon-label">GitHub</span>
                </a>
            </div>
            <div className="contact-card">
                <a href="mailto:SayesCode@proton.me" target="_blank" rel="noopener noreferrer" className="icon-link">
                    <Mail size={48} />
                    <span className="icon-label">Email</span>
                </a>
            </div>
            <div className="contact-card">
                <a href="https://discord.com/users/_sayes" target="_blank" rel="noopener noreferrer" className="icon-link">
                    <FontAwesomeIcon icon={faDiscord} size="3x" />
                    <span className="icon-label">Discord</span>
                </a>
            </div>
        </div>
    );
};

export default Contact;
