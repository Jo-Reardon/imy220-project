import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import ProjectCard from '../components/ProjectCard.js';
import CreateProjectForm from '../components/forms/CreateProjectForm.js';
import { projects } from '../utils/api.js';

function MyProjectsPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [myProjects, setMyProjects] = useState([]);
    const [memberProjects, setMemberProjects] = useState([]);
    const [showCreateProject, setShowCreateProject] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
            fetchProjects(JSON.parse(userData));
        }
    }, []);

    const fetchProjects = async (userData) => {
        try {
            const allProjects = await projects.getFeatured();
            
            // Filter projects owned by user
            const owned = allProjects.filter(p => p.ownerId === userData._id);
            setMyProjects(owned);
            
            // Filter projects where user is a member but not owner
            const member = allProjects.filter(p => 
                p.members?.includes(userData._id) && p.ownerId !== userData._id
            );
            setMemberProjects(member);
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    const handleProjectCreated = () => {
        setShowCreateProject(false);
        if (user) fetchProjects(user);
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <Header user={user} />

            <div style={styles.content}>
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        <i className="fas fa-folder"></i> Your Projects
                    </h1>
                    <button
                        style={styles.createBtn}
                        onClick={() => setShowCreateProject(true)}
                    >
                        <i className="fas fa-plus"></i> New Project
                    </button>
                </div>

                {/* Owned Projects */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <i className="fas fa-crown"></i> Owned Projects ({myProjects.length})
                    </h2>
                    {myProjects.length === 0 ? (
                        <div style={styles.empty}>
                            <i className="fas fa-cube"></i>
                            <p>You haven't created any projects yet</p>
                            <button
                                style={styles.emptyBtn}
                                onClick={() => setShowCreateProject(true)}
                            >
                                <i className="fas fa-rocket"></i> Create Your First Project
                            </button>
                        </div>
                    ) : (
                        <div style={styles.grid}>
                            {myProjects.map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Collaborating Projects */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <i className="fas fa-users"></i> Collaborating On ({memberProjects.length})
                    </h2>
                    {memberProjects.length === 0 ? (
                        <div style={styles.empty}>
                            <i className="fas fa-handshake"></i>
                            <p>You're not collaborating on any projects yet</p>
                        </div>
                    ) : (
                        <div style={styles.grid}>
                            {memberProjects.map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {showCreateProject && (
                <CreateProjectForm
                    user={user}
                    onClose={handleProjectCreated}
                />
            )}
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh' },
    loading: { color: '#fff', textAlign: 'center', marginTop: '100px', fontSize: '20px' },
    content: { maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' },
    title: { fontSize: '32px', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 },
    createBtn: { background: 'linear-gradient(135deg, #FF9A3C, #FF6B35)', border: 'none', padding: '12px 24px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' },
    section: { marginBottom: '48px' },
    sectionTitle: { fontSize: '24px', fontFamily: 'Orbitron, sans-serif', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    empty: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '60px', textAlign: 'center', opacity: 0.8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
    emptyBtn: { background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)', border: 'none', padding: '12px 24px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }
};

export default MyProjectsPage;