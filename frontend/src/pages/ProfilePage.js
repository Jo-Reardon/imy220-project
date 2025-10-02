import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';

function ProfilePage() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchProfile();
    }, [username]);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`/api/users/${username}`);
            const data = await response.json();
            setProfile(data.user);
            setProjects(data.projects);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <Header user={user} />
            
            <div style={styles.content}>
                {/* Left Profile Card */}
                <aside style={styles.profileCard}>
                    <div style={styles.avatarContainer}>
                        <div style={styles.avatar}>
                            {profile.name.charAt(0)}
                        </div>
                    </div>
                    
                    <h2 style={styles.name}>{profile.name}</h2>
                    <p style={styles.username}>@{profile.username}</p>
                    <p style={styles.bio}>"{profile.bio || "I don't push to production, I teleport."}"</p>
                    
                    <div style={styles.links}>
                        <a href="#" style={styles.link}>🌐 GitHub</a>
                        <a href="#" style={styles.link}>💼 LinkedIn</a>
                        <a href="#" style={styles.link}>🌍 Personal Site</a>
                    </div>
                    
                    <button style={styles.editBtn}>Edit Profile</button>
                    
                    <div style={styles.stats}>
                        <h3 style={styles.statsTitle}>STATS</h3>
                        <p style={styles.statItem}>Stars - 48</p>
                        <p style={styles.statItem}>Projects - {projects.length}</p>
                        <p style={styles.statItem}>Following - 92</p>
                        <p style={styles.statItem}>Followers - 112</p>
                    </div>
                </aside>

                {/* Main Content */}
                <main style={styles.main}>
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>Your Projects</h2>
                        <div style={styles.projectGrid}>
                            {projects.map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                        <button style={styles.loadMore}>Load more</button>
                    </section>
                    
                    <section style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>Captain's Logs</h2>
                            <button style={styles.addBtn}>ADD NEW LOG</button>
                        </div>
                        <div style={styles.logsContainer}>
                            <div style={styles.logEntry}>
                                <p><strong>Entry 1:</strong> "Finally got the API to respond. Must be the space radiation."</p>
                            </div>
                            <div style={styles.logEntry}>
                                <p><strong>Entry 2:</strong> "Refactored my code. Again. The bugs mutated."</p>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Right Sidebar */}
                <aside style={styles.rightSidebar}>
                    <div style={styles.widget}>
                        <h3 style={styles.widgetTitle}>Profile Highlights</h3>
                        <div style={styles.highlights}>
                            <p style={styles.highlight}>"First commit made on: 2017-08-30"</p>
                            <p style={styles.highlight}>"Most used language: JavaScript"</p>
                            <p style={styles.highlight}>"Active constellation: CodeVerse Prime"</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh'
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '300px 1fr 300px',
        gap: '20px',
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    profileCard: {
        background: 'rgba(15, 20, 50, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        textAlign: 'center',
        height: 'fit-content'
    },
    avatarContainer: {
        marginBottom: '16px'
    },
    avatar: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0FF6FC, #A259FF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        fontWeight: 700,
        margin: '0 auto',
        border: '4px solid rgba(162, 89, 255, 0.3)'
    },
    name: {
        fontSize: '24px',
        margin: '8px 0',
        fontFamily: 'Orbitron, sans-serif'
    },
    username: {
        opacity: 0.7,
        marginBottom: '12px'
    },
    bio: {
        fontStyle: 'italic',
        opacity: 0.8,
        marginBottom: '16px',
        fontSize: '14px'
    },
    links: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '16px'
    },
    link: {
        color: '#0FF6FC',
        textDecoration: 'none',
        fontSize: '14px'
    },
    editBtn: {
        width: '100%',
        background: 'linear-gradient(135deg, #FF6B9D, #C084FC)',
        border: 'none',
        padding: '12px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 600,
        cursor: 'pointer',
        marginBottom: '20px',
        fontFamily: 'Orbitron, sans-serif'
    },
    stats: {
        borderTop: '1px solid rgba(162, 89, 255, 0.3)',
        paddingTop: '16px'
    },
    statsTitle: {
        fontSize: '14px',
        marginBottom: '12px',
        fontFamily: 'Orbitron, sans-serif'
    },
    statItem: {
        margin: '8px 0',
        fontSize: '14px'
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    section: {
        background: 'rgba(15, 20, 50, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '16px',
        padding: '24px'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    sectionTitle: {
        fontSize: '22px',
        margin: 0,
        marginBottom: '16px',
        fontFamily: 'Orbitron, sans-serif'
    },
    projectGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '16px'
    },
    loadMore: {
        width: '100%',
        background: 'transparent',
        border: '2px solid rgba(162, 89, 255, 0.5)',
        padding: '12px',
        borderRadius: '8px',
        color: '#A259FF',
        cursor: 'pointer',
        fontWeight: 600
    },
    addBtn: {
        background: 'transparent',
        border: '2px solid rgba(255, 154, 60, 0.5)',
        padding: '8px 16px',
        borderRadius: '8px',
        color: '#FF9A3C',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '12px'
    },
    logsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    logEntry: {
        background: 'rgba(162, 89, 255, 0.1)',
        padding: '12px',
        borderRadius: '8px',
        borderLeft: '3px solid #A259FF'
    },
    rightSidebar: {
        height: 'fit-content'
    },
    widget: {
        background: 'rgba(15, 20, 50, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '16px',
        padding: '20px'
    },
    widgetTitle: {
        fontSize: '16px',
        marginBottom: '16px',
        fontFamily: 'Orbitron, sans-serif'
    },
    highlights: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    highlight: {
        fontSize: '14px',
        opacity: 0.8
    }
};

export default ProfilePage;