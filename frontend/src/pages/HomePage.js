import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ActivityFeed from '../components/ActivityFeed';
import ProjectCard from '../components/ProjectCard';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFolder, faUsers, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';


function HomePage() {
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState([]);
    const [projects, setProjects] = useState([]);
    const [feedType, setFeedType] = useState('local'); // 'local' or 'global'

    useEffect(() => {
        // Load user from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        // Fetch activities
        fetchActivities();
        fetchProjects();
    }, [feedType]);

    const fetchActivities = async () => {
        try {
            const response = await fetch(`/api/activity?type=${feedType}`);
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects/featured');
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    return (
        <div style={styles.container}>
            <Header user={user} />
            
            <div style={styles.content}>
                {/* Sidebar */}
                <aside style={styles.sidebar}>
                    <nav style={styles.nav}>
                        <a href="/home" style={styles.navLink}>
                            <FontAwesomeIcon icon={faHome} /> Mission Feed
                        </a>
                        <a href="/projects" style={styles.navLink}>
                            <FontAwesomeIcon icon={faFolder} /> Your Projects
                        </a>
                        <a href="/friends" style={styles.navLink}>
                            <FontAwesomeIcon icon={faUsers} /> Your Crew
                        </a>
                        <a href="/explore" style={styles.navLink}>
                            <FontAwesomeIcon icon={faSearch} /> Explore CodeVerse
                        </a>
                    </nav>

                    <div style={styles.widget}>
                        <h3 style={styles.widgetTitle}>Trending Hashtags</h3>
                        <div style={styles.hashtags}>
                            <span style={styles.hashtag}>#Python</span>
                            <span style={styles.hashtag}>#CSS</span>
                            <span style={styles.hashtag}>#WebDev</span>
                            <span style={styles.hashtag}>#React</span>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main style={styles.main}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Mission Control: Code Activity Feed</h1>
                        <div style={styles.feedToggle}>
                            <button
                                style={feedType === 'local' ? styles.toggleActive : styles.toggleInactive}
                                onClick={() => setFeedType('local')}
                            >
                                Mission Feed
                            </button>
                            <button
                                style={feedType === 'global' ? styles.toggleActive : styles.toggleInactive}
                                onClick={() => setFeedType('global')}
                            >
                                Explore
                            </button>
                        </div>
                    </div>

                    <ActivityFeed activities={activities} />

                    <div style={styles.projectsSection}>
                        <h2 style={styles.sectionTitle}>Projects</h2>
                        <div style={styles.projectGrid}>
                            {projects.map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                    </div>
                </main>

                {/* Right Sidebar */}
                <aside style={styles.rightSidebar}>
                    <div style={styles.quickCreate}>
                        <h3 style={styles.widgetTitle}>Quick Create</h3>
                        <button style={styles.createBtn}>
                            <FontAwesomeIcon icon={faPlus} /> New Project
                        </button>
                    </div>

                    <div style={styles.widget}>
                        <h3 style={styles.widgetTitle}>Friend Suggestions</h3>
                        <div style={styles.suggestions}>
                            <div style={styles.suggestion}>
                                <div style={styles.suggestionAvatar}>HS</div>
                                <span>HanSolo</span>
                            </div>
                            <div style={styles.suggestion}>
                                <div style={styles.suggestionAvatar}>PA</div>
                                <span>PadmeAmidala</span>
                            </div>
                            <div style={styles.suggestion}>
                                <div style={styles.suggestionAvatar}>AW</div>
                                <span>AniWalkerOfTheSky</span>
                            </div>
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
        gridTemplateColumns: '250px 1fr 300px',
        gap: '20px',
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    nav: {
        background: 'rgba(15, 20, 50, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    navLink: {
        color: '#EDEDED',
        textDecoration: 'none',
        padding: '12px',
        borderRadius: '8px',
        transition: 'all 0.3s ease'
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
    hashtags: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
    },
    hashtag: {
        background: 'rgba(162, 89, 255, 0.2)',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '14px',
        border: '1px solid rgba(162, 89, 255, 0.4)'
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: '28px',
        fontFamily: 'Orbitron, sans-serif'
    },
    feedToggle: {
        display: 'flex',
        gap: '8px',
        background: 'rgba(15, 20, 50, 0.8)',
        padding: '4px',
        borderRadius: '8px'
    },
    toggleActive: {
        background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        color: 'white',
        fontWeight: 600,
        cursor: 'pointer'
    },
    toggleInactive: {
        background: 'transparent',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        color: '#EDEDED',
        cursor: 'pointer'
    },
    projectsSection: {
        marginTop: '20px'
    },
    sectionTitle: {
        fontSize: '20px',
        marginBottom: '16px',
        fontFamily: 'Orbitron, sans-serif'
    },
    projectGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px'
    },
    rightSidebar: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    quickCreate: {
        background: 'rgba(15, 20, 50, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '16px',
        padding: '20px'
    },
    createBtn: {
        width: '100%',
        background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)',
        border: 'none',
        padding: '12px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 600,
        cursor: 'pointer'
    },
    suggestions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    suggestion: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    suggestionAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #A259FF, #FF6B9D)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600
    }
};

export default HomePage;