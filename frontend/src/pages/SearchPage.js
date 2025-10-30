import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header.js';
import ProjectCard from '../components/ProjectCard.js';
import { users, projects, activity } from '../utils/api.js';

function SearchPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    });
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [searchType, setSearchType] = useState(searchParams.get('type') || 'projects');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const q = searchParams.get('q');
        const type = searchParams.get('type');
        if (q) {
            setSearchQuery(q);
            if (type) setSearchType(type);
            performSearch(q, type || searchType);
        }
    }, [searchParams]);

    const performSearch = async (query, type) => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            let data;
            switch (type) {
                case 'users':
                    data = await users.search(query);
                    setResults(data.users || []);
                    break;
                case 'projects':
                    data = await projects.search(query);
                    setResults(data.projects || []);
                    break;
                case 'activity':
                    data = await activity.search(query);
                    setResults(data.activities || []);
                    break;
                default:
                    setResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        }
        setLoading(false);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        performSearch(searchQuery, searchType);
    };

    const handleUserClick = (username) => {
        navigate(`/profile/${username}`);
    };

    return (
        <div style={styles.container}>
            <Header user={user} />

            <div style={styles.content}>
                <div style={styles.searchSection}>
                    <h1 style={styles.title}>
                        <i className="fas fa-search"></i> Search CodeVerse
                    </h1>

                    <form onSubmit={handleSearch} style={styles.searchForm}>
                        <div style={styles.searchBar}>
                            <i className="fas fa-search" style={styles.searchIcon}></i>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={`Search ${searchType}...`}
                                style={styles.searchInput}
                            />
                        </div>

                        <div style={styles.filterGroup}>
                            <button
                                type="button"
                                style={searchType === 'projects' ? styles.filterActive : styles.filterInactive}
                                onClick={() => setSearchType('projects')}
                            >
                                <i className="fas fa-project-diagram"></i> Projects
                            </button>
                            <button
                                type="button"
                                style={searchType === 'users' ? styles.filterActive : styles.filterInactive}
                                onClick={() => setSearchType('users')}
                            >
                                <i className="fas fa-users"></i> Users
                            </button>
                            <button
                                type="button"
                                style={searchType === 'activity' ? styles.filterActive : styles.filterInactive}
                                onClick={() => setSearchType('activity')}
                            >
                                <i className="fas fa-stream"></i> Activity
                            </button>
                        </div>

                        <button type="submit" style={styles.searchBtn}>
                            <i className="fas fa-rocket"></i> Search
                        </button>
                    </form>
                </div>

                <div style={styles.resultsSection}>
                    {loading ? (
                        <div style={styles.loading}>
                            <i className="fas fa-spinner fa-spin"></i> Searching...
                        </div>
                    ) : results.length === 0 ? (
                        <div style={styles.noResults}>
                            <i className="fas fa-satellite"></i>
                            <p>No results found. Try a different search term.</p>
                        </div>
                    ) : (
                        <>
                            <h2 style={styles.resultsTitle}>
                                Found {results.length} {searchType}
                            </h2>

                            {searchType === 'projects' && (
                                <div style={styles.projectGrid}>
                                    {results.map(project => (
                                        <ProjectCard key={project._id} project={project} />
                                    ))}
                                </div>
                            )}

                            {searchType === 'users' && (
                                <div style={styles.userList}>
                                    {results.map(user => (
                                        <div
                                            key={user._id}
                                            style={styles.userCard}
                                            onClick={() => handleUserClick(user.username)}
                                        >
                                            <div style={styles.userAvatar}>
                                                <i className="fas fa-user-astronaut"></i>
                                            </div>
                                            <div style={styles.userInfo}>
                                                <h3 style={styles.userName}>{user.name}</h3>
                                                <p style={styles.userUsername}>@{user.username}</p>
                                                <p style={styles.userBio}>{user.bio || 'No bio'}</p>
                                            </div>
                                            <i className="fas fa-chevron-right" style={styles.chevron}></i>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {searchType === 'activity' && (
                                <div style={styles.activityList}>
                                    {results.map((act, index) => (
                                        <div key={index} style={styles.activityCard}>
                                            <i className="fas fa-code-branch" style={styles.activityIcon}></i>
                                            <div>
                                                <p><strong>{act.username}</strong> {act.action}</p>
                                                {act.message && (
                                                    <p style={styles.activityMessage}>
                                                        <i className="fas fa-comment"></i> {act.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh' },
    content: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
    searchSection: { marginBottom: '40px' },
    title: { fontSize: '32px', fontFamily: 'Orbitron, sans-serif', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' },
    searchForm: { display: 'flex', flexDirection: 'column', gap: '16px' },
    searchBar: { position: 'relative' },
    searchIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#0FF6FC', fontSize: '18px' },
    searchInput: { width: '100%', background: 'rgba(15, 20, 50, 0.8)', border: '2px solid rgba(162, 89, 255, 0.3)', borderRadius: '12px', padding: '16px 16px 16px 48px', color: '#EDEDED', fontSize: '16px' },
    filterGroup: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
    filterActive: { background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)', border: 'none', padding: '10px 20px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    filterInactive: { background: 'rgba(15, 20, 50, 0.6)', border: '2px solid rgba(162, 89, 255, 0.3)', padding: '10px 20px', borderRadius: '8px', color: '#EDEDED', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    searchBtn: { background: 'linear-gradient(135deg, #FF9A3C, #FF6B35)', border: 'none', padding: '14px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    resultsSection: {},
    loading: { textAlign: 'center', fontSize: '20px', padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
    noResults: { textAlign: 'center', opacity: 0.6, padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', fontSize: '18px' },
    resultsTitle: { fontSize: '24px', fontFamily: 'Orbitron, sans-serif', marginBottom: '24px' },
    projectGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    userList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    userCard: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.3s ease' },
    userAvatar: { width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #0FF6FC, #A259FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
    userInfo: { flex: 1 },
    userName: { margin: 0, fontSize: '18px', fontFamily: 'Orbitron, sans-serif' },
    userUsername: { margin: '4px 0', opacity: 0.7, fontSize: '14px' },
    userBio: { margin: '4px 0', fontSize: '14px', opacity: 0.8 },
    chevron: { opacity: 0.5 },
    activityList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    activityCard: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px' },
    activityIcon: { fontSize: '20px', color: '#0FF6FC' },
    activityMessage: { fontSize: '14px', opacity: 0.8, marginTop: '8px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }
};

export default SearchPage;