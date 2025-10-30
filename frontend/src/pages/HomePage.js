import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import ActivityFeed from '../components/ActivityFeed.js';
import ProjectCard from '../components/ProjectCard.js';
import { activity, projects, users } from '../utils/api.js';

function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState([]);
    const [projectsList, setProjectsList] = useState([]);
    const [feedType, setFeedType] = useState('local');
    const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'popular'
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('projects'); // 'projects', 'users', 'checkins'
    const [trendingHashtags, setTrendingHashtags] = useState([]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchActivities();
            fetchProjects();
            calculateTrendingHashtags();
        }
    }, [feedType, sortBy, user]);

    const fetchActivities = async () => {
        try {
            const data = await activity.getFeed(feedType, user._id);
            
            // Sort activities based on sortBy
            let sortedActivities = [...data];
            if (sortBy === 'popular') {
                // Sort by number of downloads (you'll need to add this to activity data)
                sortedActivities.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
            } else {
                // Already sorted by recent (createdAt) from backend
            }
            
            setActivities(sortedActivities);
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

    const calculateTrendingHashtags = () => {
        // Count hashtag occurrences across all projects
        const hashtagCounts = {};
        projectsList.forEach(project => {
            (project.languages || []).forEach(lang => {
                hashtagCounts[lang] = (hashtagCounts[lang] || 0) + 1;
            });
        });

        // Sort by count and get top 8
        const sorted = Object.entries(hashtagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([lang, count]) => ({ lang, count }));

        setTrendingHashtags(sorted);
    };

    const handleHashtagClick = (hashtag) => {
        navigate(`/search?q=${encodeURIComponent(hashtag)}&type=projects`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
        }
    };

    if (loading || !user) {
        return (
            <div style={styles.loading}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px' }}></i>
                <span>Loading Mission Control...</span>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Header user={user} />

            <div style={styles.content}>
                {/* RIGHT SIDEBAR - 25% */}
                <aside style={styles.sidebar}>
                    {/* Quick Create Section */}
                    <div style={styles.widget}>
                        <h3 style={styles.widgetTitle}>
                            <i className="fas fa-plus-circle"></i> Quick Create
                        </h3>
                        <button 
                            style={styles.createBtn} 
                            onClick={() => navigate('/create-project')}
                        >
                            <i className="fas fa-rocket"></i> Launch New Project
                        </button>
                    </div>

                    {/* Trending Hashtags Section */}
                    <div style={styles.widget}>
                        <h3 style={styles.widgetTitle}>
                            <i className="fas fa-fire"></i> Trending Languages
                        </h3>
                        <div style={styles.hashtags}>
                            {trendingHashtags.length === 0 ? (
                                <p style={styles.noData}>No trending languages yet</p>
                            ) : (
                                trendingHashtags.map((item, i) => (
                                    <div 
                                        key={i} 
                                        style={styles.hashtagItem}
                                        onClick={() => handleHashtagClick(item.lang)}
                                    >
                                        <span style={styles.hashtag}>
                                            <i className="fas fa-hashtag"></i> {item.lang}
                                        </span>
                                        <span style={styles.hashtagCount}>{item.count}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Search Widget - Integrated into Home Page */}
                    <div style={styles.widget}>
                        <h3 style={styles.widgetTitle}>
                            <i className="fas fa-search"></i> Quick Search
                        </h3>
                        <form onSubmit={handleSearch} style={styles.searchForm}>
                            <select 
                                value={searchType} 
                                onChange={(e) => setSearchType(e.target.value)}
                                style={styles.searchSelect}
                            >
                                <option value="projects">Projects</option>
                                <option value="users">Users</option>
                                <option value="checkins">Check-ins</option>
                            </select>
                            <div style={styles.searchInputWrapper}>
                                <input
                                    type="text"
                                    placeholder={`Search ${searchType}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={styles.searchInput}
                                />
                                <button type="submit" style={styles.searchBtn}>
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* User Stats */}
                    <div style={styles.widget}>
                        <h3 style={styles.widgetTitle}>
                            <i className="fas fa-chart-bar"></i> Your Stats
                        </h3>
                        <div style={styles.stats}>
                            <div style={styles.statItem}>
                                <span style={styles.statValue}>{user.projects?.length || 0}</span>
                                <span style={styles.statLabel}>Projects</span>
                            </div>
                            <div style={styles.statItem}>
                                <span style={styles.statValue}>{user.friends?.length || 0}</span>
                                <span style={styles.statLabel}>Friends</span>
                            </div>
                            <div style={styles.statItem}>
                                <span style={styles.statValue}>{activities.filter(a => a.userId === user._id).length}</span>
                                <span style={styles.statLabel}>Check-ins</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT - 75% */}
                <main style={styles.main}>
                    {/* Activity Feed Controls */}
                    <div style={styles.feedHeader}>
                        <div style={styles.feedInfo}>
                            <h1 style={styles.title}>
                                <i className="fas fa-satellite-dish"></i> 
                                {feedType === 'local' ? 'Mission Feed' : 'Global Activity'}
                            </h1>
                            <p style={styles.subtitle}>
                                {feedType === 'local' 
                                    ? 'Activity from you and your crew' 
                                    : 'Activity from all CodeVerse users'
                                }
                            </p>
                        </div>
                        
                        <div style={styles.controls}>
                            {/* Feed Type Toggle */}
                            <div style={styles.feedToggle}>
                                <button
                                    style={feedType === 'local' ? styles.toggleActive : styles.toggleInactive}
                                    onClick={() => setFeedType('local')}
                                    title="Show activity from friends only"
                                >
                                    <i className="fas fa-user-friends"></i> Local
                                </button>
                                <button
                                    style={feedType === 'global' ? styles.toggleActive : styles.toggleInactive}
                                    onClick={() => setFeedType('global')}
                                    title="Show activity from all users"
                                >
                                    <i className="fas fa-globe"></i> Global
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <div style={styles.sortControl}>
                                <label style={styles.sortLabel}>
                                    <i className="fas fa-sort"></i> Sort:
                                </label>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={styles.sortSelect}
                                >
                                    <option value="recent">Most Recent</option>
                                    <option value="popular">Most Popular</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Activity Feed Section */}
                    <section style={styles.activitySection}>
                        <ActivityFeed 
                            activities={activities} 
                            currentUserId={user._id}
                        />
                    </section>

                    {/* Projects Section */}
                    <section style={styles.projectsSection}>
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>
                                <i className="fas fa-rocket"></i> Featured Projects
                            </h2>
                            <Link to="/projects" style={styles.viewAllLink}>
                                View All <i className="fas fa-arrow-right"></i>
                            </Link>
                        </div>
                        
                        {projectsList.length === 0 ? (
                            <div style={styles.emptyState}>
                                <i className="fas fa-folder-open" style={styles.emptyIcon}></i>
                                <p style={styles.emptyText}>No projects in the CodeVerse yet</p>
                                <button 
                                    style={styles.createBtn}
                                    onClick={() => navigate('/create-project')}
                                >
                                    <i className="fas fa-plus"></i> Create First Project
                                </button>
                            </div>
                        ) : (
                            <div style={styles.projectGrid}>
                                {projectsList.slice(0, 6).map(project => (
                                    <ProjectCard key={project._id} project={project} />
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}

const styles = {
    container: { 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0B0F2B 0%, #1a1a2e 100%)',
        color: '#EDEDED'
    },
    loading: { 
        color: '#fff', 
        textAlign: 'center', 
        marginTop: '100px', 
        fontSize: '18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
    },
    content: { 
        display: 'grid', 
        gridTemplateColumns: '1fr 350px', // Main content first, then sidebar
        gap: '24px', 
        padding: '24px', 
        maxWidth: '1600px', 
        margin: '0 auto'
    },
    
    // MAIN CONTENT STYLES (75%)
    main: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px',
        minHeight: '100vh'
    },
    feedHeader: {
        background: 'rgba(15, 20, 50, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
    },
    feedInfo: {
        flex: 1
    },
    title: { 
        fontSize: '28px', 
        fontFamily: 'Orbitron, sans-serif', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        margin: '0 0 8px 0',
        background: 'linear-gradient(135deg, #0FF6FC, #A259FF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    subtitle: {
        fontSize: '14px',
        opacity: 0.7,
        margin: 0
    },
    controls: {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    feedToggle: { 
        display: 'flex', 
        gap: '8px', 
        background: 'rgba(11, 15, 43, 0.6)', 
        padding: '4px', 
        borderRadius: '12px',
        border: '1px solid rgba(162, 89, 255, 0.2)'
    },
    toggleActive: { 
        background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)', 
        border: 'none', 
        padding: '10px 20px', 
        borderRadius: '8px', 
        color: 'white', 
        fontWeight: 600, 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(15, 246, 252, 0.3)'
    },
    toggleInactive: { 
        background: 'transparent', 
        border: 'none', 
        padding: '10px 20px', 
        borderRadius: '8px', 
        color: '#EDEDED', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        opacity: 0.7
    },
    sortControl: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(11, 15, 43, 0.6)',
        padding: '8px 16px',
        borderRadius: '12px',
        border: '1px solid rgba(162, 89, 255, 0.2)'
    },
    sortLabel: {
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontWeight: 600
    },
    sortSelect: {
        background: 'rgba(162, 89, 255, 0.2)',
        border: '1px solid rgba(162, 89, 255, 0.4)',
        color: '#EDEDED',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
        fontWeight: 500,
        outline: 'none'
    },
    activitySection: {
        minHeight: '400px'
    },
    projectsSection: {
        background: 'rgba(15, 20, 50, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '16px',
        padding: '24px'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    sectionTitle: { 
        fontSize: '22px', 
        fontFamily: 'Orbitron, sans-serif', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        margin: 0
    },
    viewAllLink: {
        color: '#0FF6FC',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.3s ease'
    },
    projectGrid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        opacity: 0.6
    },
    emptyIcon: {
        fontSize: '48px',
        marginBottom: '16px',
        opacity: 0.5
    },
    emptyText: {
        fontSize: '16px',
        marginBottom: '20px'
    },
    
    // SIDEBAR STYLES (25%)
    sidebar: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px',
        position: 'sticky',
        top: '90px',
        height: 'fit-content',
        maxHeight: 'calc(100vh - 110px)',
        overflowY: 'auto'
    },
    widget: { 
        background: 'rgba(15, 20, 50, 0.8)', 
        backdropFilter: 'blur(10px)', 
        border: '1px solid rgba(162, 89, 255, 0.3)', 
        borderRadius: '16px', 
        padding: '20px',
        transition: 'all 0.3s ease'
    },
    widgetTitle: { 
        fontSize: '16px', 
        marginBottom: '16px', 
        fontFamily: 'Orbitron, sans-serif', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        margin: '0 0 16px 0',
        color: '#0FF6FC'
    },
    createBtn: { 
        width: '100%', 
        background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)', 
        border: 'none', 
        padding: '14px', 
        borderRadius: '10px', 
        color: 'white', 
        fontWeight: 600, 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '10px',
        fontSize: '15px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(15, 246, 252, 0.3)'
    },
    hashtags: { 
        display: 'flex', 
        flexDirection: 'column',
        gap: '10px' 
    },
    hashtagItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 12px',
        background: 'rgba(162, 89, 255, 0.1)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    hashtag: { 
        fontSize: '14px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px',
        fontWeight: 500
    },
    hashtagCount: {
        background: 'rgba(15, 246, 252, 0.2)',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        color: '#0FF6FC'
    },
    searchForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    searchSelect: {
        width: '100%',
        background: 'rgba(162, 89, 255, 0.2)',
        border: '1px solid rgba(162, 89, 255, 0.4)',
        color: '#EDEDED',
        padding: '10px 12px',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        fontWeight: 500,
        outline: 'none'
    },
    searchInputWrapper: {
        display: 'flex',
        gap: '8px'
    },
    searchInput: {
        flex: 1,
        background: 'rgba(11, 15, 43, 0.6)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        color: '#EDEDED',
        padding: '10px 12px',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none'
    },
    searchBtn: {
        background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)',
        border: 'none',
        color: 'white',
        padding: '10px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.3s ease'
    },
    stats: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    statItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        background: 'rgba(162, 89, 255, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(162, 89, 255, 0.2)'
    },
    statLabel: {
        fontSize: '14px',
        opacity: 0.8
    },
    statValue: {
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'Orbitron, sans-serif',
        color: '#0FF6FC'
    },
    noData: {
        fontSize: '13px',
        opacity: 0.6,
        textAlign: 'center',
        padding: '12px'
    }
};

export default HomePage;