import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Header from '../components/Header.js';
import ActivityFeed from '../components/ActivityFeed.js';
import ProjectCard from '../components/ProjectCard.js';
import FriendsList from '../components/FriendsList.js';
import { activity, projects } from '../utils/api.js';

function HomePage() {
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState([]);
    const [projectsList, setProjectsList] = useState([]);
    const [feedType, setFeedType] = useState('local');
    const [loading, setLoading] = useState(true);

    // Load user from localStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Fetch activities & projects after user is loaded
    useEffect(() => {
        if (user) {
            fetchActivities();
            fetchProjects();
        }
    }, [feedType, user]);

    const fetchActivities = async () => {
        try {
            const data = await activity.getFeed(feedType, user._id);
            setActivities(data);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setActivities([]);
        }
    };

    const fetchProjects = async () => {
        try {
            const data = await projects.getFeatured();
            setProjectsList(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjectsList([]);
            setLoading(false);
        }
    };

    if (loading || !user) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <Header user={user} />

            <div style={styles.content}>
                {/* Sidebar */}
                <aside style={styles.sidebar}>
                    <nav style={styles.nav}>
                        <a href="/home" style={styles.navLink}>
                            <FontAwesomeIcon icon="house" style={{ fontSize: '14px', color: 'white' }} />
                            Mission Feed
                        </a>
                        <a href="/projects" style={styles.navLink}>
                            <i className="fas fa-folder"></i> Your Projects
                        </a>
                        <Link to="/friends" style={styles.navLink}>
                            <i className="fas fa-users"></i> Your Crew
                        </Link>
                        <a href="/explore" style={styles.navLink}>
                            <i className="fas fa-rocket"></i> Explore CodeVerse
                        </a>
                    </nav>

                    <div style={styles.widget}>
                        <h3 style={styles.widgetTitle}>
                            <i className="fas fa-hashtag"></i> Trending Hashtags
                        </h3>
                        <div style={styles.hashtags}>
                            {[...new Set(projectsList.flatMap(p => p.languages || []))].slice(0, 6).map((lang, i) => (
                                <span key={i} style={styles.hashtag}>
                                    <i className="fas fa-code"></i> {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main style={styles.main}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>
                            <i className="fas fa-satellite-dish"></i> Mission Control: Code Activity Feed
                        </h1>
                        <div style={styles.feedToggle}>
                            <button
                                style={feedType === 'local' ? styles.toggleActive : styles.toggleInactive}
                                onClick={() => setFeedType('local')}
                            >
                                <i className="fas fa-user-group"></i> Mission Feed
                            </button>
                            <button
                                style={feedType === 'global' ? styles.toggleActive : styles.toggleInactive}
                                onClick={() => setFeedType('global')}
                            >
                                <i className="fas fa-globe"></i> Explore
                            </button>
                        </div>
                    </div>

                    <ActivityFeed activities={activities} />

                    <div style={styles.projectsSection}>
                        <h2 style={styles.sectionTitle}>
                            <i className="fas fa-diagram-project"></i> Projects
                        </h2>
                        <div style={styles.projectGrid}>
                            {projectsList.map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                    </div>
                </main>

                {/* Right Sidebar */}
                <aside style={styles.rightSidebar}>
                    <div style={styles.quickCreate}>
                        <h3 style={styles.widgetTitle}>
                            <i className="fas fa-plus-circle"></i> Quick Create
                        </h3>
                        <Link to="/projects/new" style={styles.createBtn}>
                            <i className="fas fa-plus"></i> New Project
                        </Link>
                    </div>

                    {/* Only render FriendsList if user is available */}
                    {user && <FriendsList userId={user._id} />}
                </aside>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh' },
    loading: { color: '#fff', textAlign: 'center', marginTop: '100px', fontSize: '20px' },
    content: { display: 'grid', gridTemplateColumns: '250px 1fr 300px', gap: '20px', padding: '20px', maxWidth: '1400px', margin: '0 auto' },
    sidebar: { display: 'flex', flexDirection: 'column', gap: '20px' },
    nav: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
    navLink: { color: '#EDEDED', textDecoration: 'none', padding: '12px', borderRadius: '8px', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px' },
    widget: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '20px' },
    widgetTitle: { fontSize: '16px', marginBottom: '16px', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' },
    hashtags: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    hashtag: { background: 'rgba(162, 89, 255, 0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', border: '1px solid rgba(162, 89, 255, 0.4)', display: 'flex', alignItems: 'center', gap: '6px' },
    main: { display: 'flex', flexDirection: 'column', gap: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
    title: { fontSize: '24px', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', gap: '12px' },
    feedToggle: { display: 'flex', gap: '8px', background: 'rgba(15, 20, 50, 0.8)', padding: '4px', borderRadius: '8px' },
    toggleActive: { background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)', border: 'none', padding: '8px 16px', borderRadius: '6px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    toggleInactive: { background: 'transparent', border: 'none', padding: '8px 16px', borderRadius: '6px', color: '#EDEDED', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    projectsSection: { marginTop: '20px' },
    sectionTitle: { fontSize: '20px', marginBottom: '16px', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' },
    projectGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' },
    rightSidebar: { display: 'flex', flexDirection: 'column', gap: '20px', zIndex: '99999999' },
    quickCreate: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '20px' },
    createBtn: { width: '100%', background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)', border: 'none', padding: '12px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
};

export default HomePage;
