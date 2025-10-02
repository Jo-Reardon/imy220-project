import React from 'react';
import { Link } from 'react-router-dom';

function Header({ user, onLogout }) {
    return (
        <header style={styles.header}>
            <div style={styles.logo}>
                <img src="/assets/images/rocket-icon.svg" alt="Rocket" style={styles.logoIcon} />
                <div>
                    <h1 style={styles.logoText}>CodeVerse</h1>
                    <p style={styles.tagline}>Collaborative Coding Across the Stars</p>
                </div>
            </div>
            
            {user && (
                <nav style={styles.nav}>
                    <Link to="/home" style={styles.navLink}>Mission Feed</Link>
                    <Link to="/explore" style={styles.navLink}>Explore</Link>
                    <Link to={`/profile/${user.username}`} style={styles.navLink}>
                        <img src={user.avatar} alt={user.name} style={styles.avatar} />
                    </Link>
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
        background: 'rgba(11, 15, 43, 0.6)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(162, 89, 255, 0.3)'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    logoIcon: {
        width: '40px',
        height: '40px'
    },
    logoText: {
        fontSize: '28px',
        margin: 0,
        background: 'linear-gradient(135deg, #0FF6FC, #A259FF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    tagline: {
        fontSize: '12px',
        margin: 0,
        opacity: 0.7
    },
    nav: {
        display: 'flex',
        gap: '24px',
        alignItems: 'center'
    },
    navLink: {
        color: '#EDEDED',
        fontWeight: 500,
        transition: 'color 0.3s ease'
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '2px solid #0FF6FC'
    }
};

export default Header;