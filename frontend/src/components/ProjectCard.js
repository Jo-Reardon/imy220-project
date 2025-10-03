import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProjectCard({ project }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/project/${project._id}`);
    };

    const getTimeAgo = (date) => {
        const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'today';
        if (days === 1) return 'yesterday';
        return `${days} days ago`;
    };

    return (
        <div style={styles.card} onClick={handleClick}>
            <div style={styles.header}>
                <h4 style={styles.title}>
                    <i className="fas fa-cube"></i> {project.name}
                </h4>
                <span style={styles.status}>
                    {project.status === 'checked-out' ? 
                        <i className="fas fa-lock" title="Checked Out"></i> : 
                        <i className="fas fa-lock-open" title="Available"></i>
                    }
                </span>
            </div>
            
            <p style={styles.description}>{project.description}</p>
            
            <div style={styles.tags}>
                {project.languages && project.languages.map((lang, index) => (
                    <span key={index} style={styles.tag}>
                        <i className="fas fa-hashtag"></i>{lang}
                    </span>
                ))}
            </div>
            
            <div style={styles.footer}>
                <span style={styles.updated}>
                    <i className="far fa-calendar-alt"></i> {getTimeAgo(project.updatedAt)}
                </span>
                <span style={styles.version}>
                    <i className="fas fa-code-branch"></i> v{project.version}
                </span>
            </div>
        </div>
    );
}

const styles = {
    card: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all 0.3s ease' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    title: { fontSize: '18px', margin: 0, fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' },
    status: { fontSize: '20px', color: '#0FF6FC' },
    description: { fontSize: '14px', opacity: 0.8, marginBottom: '12px', minHeight: '40px' },
    tags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' },
    tag: { background: 'rgba(255, 154, 60, 0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', border: '1px solid rgba(255, 154, 60, 0.4)', display: 'flex', alignItems: 'center', gap: '4px' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', opacity: 0.6 },
    updated: { display: 'flex', alignItems: 'center', gap: '4px' },
    version: { fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px' }
};

export default ProjectCard;