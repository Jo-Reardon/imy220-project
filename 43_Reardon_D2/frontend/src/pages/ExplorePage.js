import React, { useState, useEffect } from 'react';
import Header from '../components/Header.js';
import ProjectCard from '../components/ProjectCard.js';
import { projects as projectsAPI } from '../utils/api.js';

function ExplorePage() {
    const [user, setUser] = useState(null);
    const [projectList, setProjectList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get logged in user
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));

        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await projectsAPI.getAll(); // your API method to fetch all projects
            setProjectList(data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    if (loading) return <div style={styles.loading}>Loading projects...</div>;

    return (
        <div style={styles.container}>
            <Header user={user} />

            <main style={styles.mainContent}>
                <h2 style={styles.title}>Explore Projects</h2>

                {projectList.length === 0 ? (
                    <p style={styles.noProjects}>No projects found.</p>
                ) : (
                    <div style={styles.projectGrid}>
                        {projectList.map(project => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: 'rgba(11,15,43,0.5)', paddingBottom: '40px' },
    mainContent: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
    title: { fontSize: '28px', fontFamily: 'Orbitron, sans-serif', marginBottom: '24px', color: '#EDEDED' },
    projectGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
    noProjects: { color: '#A259FF', fontSize: '18px', textAlign: 'center', marginTop: '40px' },
    loading: { color: '#fff', textAlign: 'center', marginTop: '100px', fontSize: '20px' }
};

export default ExplorePage;
