import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProjectCard({ project }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/project/${project._id}`);
    };

    return (
        <div style={styles.card} onClick={handleClick}>
            <div style={styles.header}>
                <h4 style={styles.title}>{project.name}</h4>
                <span style={styles.status}>
                    {project.checkedOut ? '🔒 Checked Out' : '🔓 Available'}
                </span>
            </div>
            
            <p style={styles.description}>{project.description}</p>
            
            <div style={styles.tags}>
                {project.languages && project.languages.map((lang, index) => (
                    <span key={index} style={styles.tag}>#{lang}</span>
                ))}
            </div>
            
            <div style={styles.footer}>
                <span style={styles.updated}>Updated: {project.lastUpdated}</span>
                <span style={styles.star}>⭐ Star</span>
            </div>
        </div>
    );
}

const styles = {
    card: {
        background: 'rgba(15, 20, 50, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
    },
    title: {
        fontSize: '18px',
        margin: 0,
        fontFamily: 'Orbitron, sans-serif'
    },
    status: {
        fontSize: '12px',
        opacity: 0.8
    },
    description: {
        fontSize: '14px',
        opacity: 0.8,
        marginBottom: '12px'
    },
    tags: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '12px'
    },
    tag: {
        background: 'rgba(255, 154, 60, 0.2)',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        border: '1px solid rgba(255, 154, 60, 0.4)'
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px'
    },
    updated: {
        opacity: 0.6
    },
    star: {
        cursor: 'pointer'
    }
};

export default ProjectCard;