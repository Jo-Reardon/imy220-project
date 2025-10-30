import React, { useState, useEffect } from 'react';
import Header from '../components/Header.js';
import ProjectCard from '../components/ProjectCard.js';
import { projects } from '../utils/api.js';

function ExplorePage() {
    const [user, setUser] = useState(null);
    const [allProjects, setAllProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedType, setSelectedType] = useState('All');
    const [loading, setLoading] = useState(true);

    const projectTypes = [
        'All',
        'Web Application',
        'Mobile Application',
        'Desktop Application',
        'Library',
        'Framework',
        'Algorithm',
        'API',
        'Tool'
    ];

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedType === 'All') {
            setFilteredProjects(allProjects);
        } else {
            setFilteredProjects(allProjects.filter(p => p.type === selectedType));
        }
    }, [selectedType, allProjects]);

    const fetchProjects = async () => {
        try {
            const data = await projects.getFeatured();
            setAllProjects(data);
            setFilteredProjects(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <Header user={user} />

            <div style={styles.content}>
                <h1 style={styles.title}>
                    <i className="fas fa-rocket"></i> Explore CodeVerse
                </h1>

                <div style={styles.filterSection}>
                    <p style={styles.filterLabel}>
                        <i className="fas fa-filter"></i> Filter by type:
                    </p>
                    <div style={styles.filterButtons}>
                        {projectTypes.map(type => (
                            <button
                                key={type}
                                style={selectedType === type ? styles.filterActive : styles.filterInactive}
                                onClick={() => setSelectedType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={styles.resultsInfo}>
                    <p>
                        Showing {filteredProjects.length} of {allProjects.length} projects
                    </p>
                </div>

                {filteredProjects.length === 0 ? (
                    <div style={styles.empty}>
                        <i className="fas fa-satellite"></i>
                        <p>No projects found with this filter</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {filteredProjects.map(project => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh' },
    loading: { color: '#fff', textAlign: 'center', marginTop: '100px', fontSize: '20px' },
    content: { maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' },
    title: { fontSize: '32px', fontFamily: 'Orbitron, sans-serif', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' },
    filterSection: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px' },
    filterLabel: { fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
    filterButtons: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    filterActive: { background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)', border: 'none', padding: '8px 16px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' },
    filterInactive: { background: 'rgba(162, 89, 255, 0.1)', border: '1px solid rgba(162, 89, 255, 0.3)', padding: '8px 16px', borderRadius: '8px', color: '#EDEDED', cursor: 'pointer' },
    resultsInfo: { marginBottom: '20px', opacity: 0.7 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    empty: { textAlign: 'center', padding: '60px', opacity: 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', fontSize: '18px' }
};

export default ExplorePage;