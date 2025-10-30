import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../utils/api.js';

function Header({ user }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await auth.logout();
        navigate('/');
    };

    return (
        <header style={styles.header}>
            <Link to="/home" style={styles.logoLink}>
                <div style={styles.logo}>
                    <i className="fas fa-rocket" style={styles.logoIcon}></i>
                    <div>
                        <h1 style={styles.logoText}>CodeVerse</h1>
                        <p style={styles.tagline}>Collaborative Coding Across the Stars</p>
                    </div>
                </div>
            </Link>
            
            {user && (
                <nav style={styles.nav}>
                    <Link to="/home" style={styles.navLink}>
                        <i className="fas fa-home"></i> Home
                    </Link>
                    <Link to="/projects" style={styles.navLink}>
                        <i className="fas fa-folder"></i> Projects
                    </Link>
                    <Link to="/friends" style={styles.navLink}>
                        <i className="fas fa-users"></i> Friends
                    </Link>
                    <Link to="/explore" style={styles.navLink}>
                        <i className="fas fa-rocket"></i> Explore
                    </Link>
                    <Link to="/search" style={styles.navLink}>
                        <i className="fas fa-search"></i> Search
                    </Link>
                    <Link to={`/profile/${user.username}`} style={styles.profileLink}>
                        <div style={styles.avatar}>
                            <i className="fas fa-user-astronaut"></i>
                        </div>
                        <span>{user.name}</span>
                    </Link>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </nav>
            )}
        </header>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        background: 'rgba(11, 15, 43, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(162, 89, 255, 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 100
    },
    logoLink: {
        textDecoration: 'none'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    logoIcon: {
        fontSize: '32px',
        color: '#0FF6FC'
    },
    logoText: {
        fontSize: '24px',
        margin: 0,
        background: 'linear-gradient(135deg, #0FF6FC, #A259FF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: 'Orbitron, sans-serif'
    },
    tagline: {
        fontSize: '10px',
        margin: 0,
        opacity: 0.7,
        color: '#EDEDED'
    },
    nav: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
    },
    navLink: {
        color: '#EDEDED',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '14px'
    },
    profileLink: {
        color: '#EDEDED',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        borderRadius: '8px',
        background: 'rgba(162, 89, 255, 0.1)',
        border: '1px solid rgba(162, 89, 255, 0.3)'
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0FF6FC, #A259FF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px'
    },
    logoutBtn: {
        background: 'transparent',
        border: '1px solid #FF4B5C',
        color: '#FF4B5C',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '14px'
    }
};

export default Header;