import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAstronaut, faChevronDown, faSignOutAlt, faUser, faCog } from '@fortawesome/free-solid-svg-icons';

function Header({ user }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        navigate('/');
    };

    return (
        <header style={styles.header}>
            <div style={styles.logo}>
                <img
                    src="/assets/images/rocket-logo.png"
                    alt="Rocket"
                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                />

                <div>
                    <h1 style={styles.logoText}>CodeVerse</h1>
                    <p style={styles.tagline}>Collaborative Coding Across the Stars</p>
                </div>
            </div>
            
            {user && (
                <nav style={styles.nav}>
                    <Link to="/home" style={styles.navLink}>Mission Feed</Link>
                    <Link to="/explore" style={styles.navLink}>Explore</Link>
                    
                    <div style={styles.userMenuContainer}>
                        <button 
                            style={styles.userButton}
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <FontAwesomeIcon icon={faUserAstronaut} style={styles.avatarIcon} />
                            <FontAwesomeIcon 
                                icon={faChevronDown} 
                                style={{
                                    ...styles.chevron,
                                    transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
                                }} 
                            />
                        </button>

                        {showDropdown && (
                            <div style={styles.dropdown}>
                                <button 
                                    style={{...styles.dropdownItem, ...styles.logoutButton}}
                                    onClick={handleLogout}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} />
                                    <span>Logout</span>
                                </button>

                                <Link 
                                    to={`/profile/${user.username}`} 
                                    style={styles.dropdownItem}
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <FontAwesomeIcon icon={faUser} />
                                    <span>View Profile</span>
                                </Link>
                                
                                <Link 
                                    to="/settings" 
                                    style={styles.dropdownItem}
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <FontAwesomeIcon icon={faCog} />
                                    <span>Settings</span>
                                </Link>
                                
                                <div style={styles.divider}></div>
                                
                            </div>
                        )}
                    </div>
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
        borderBottom: '1px solid rgba(162, 89, 255, 0.3)',
        position: 'relative'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    logoText: {
        fontSize: '28px',
        margin: 0,
        background: 'linear-gradient(135deg, #0FF6FC, #ffa459ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    tagline: {
        fontSize: '12px',
        margin: 0,
        opacity: 0.7,
        color: '#EDEDED'
    },
    nav: {
        display: 'flex',
        gap: '24px',
        alignItems: 'center'
    },
    navLink: {
        color: '#EDEDED',
        fontWeight: 500,
        transition: 'color 0.3s ease',
        textDecoration: 'none'
    },
    userMenuContainer: {
        position: 'relative'
    },
    userButton: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px'
    },
    avatarIcon: {
        fontSize: '20px',
        color: 'rgb(15, 20, 50)',
        borderRadius: '50%',
        padding: '6px',
        background: '#fff'
    },
    chevron: {
        fontSize: '12px',
        color: '#EDEDED',
        transition: 'transform 0.3s ease'
    },
    dropdown: {
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        background: 'rgba(11, 15, 43, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '12px',
        padding: '8px',
        minWidth: '180px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        zIndex: 9999999999
    },
    dropdownItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        color: '#EDEDED',
        textDecoration: 'none',
        background: 'transparent',
        border: 'none',
        width: '100%',
        cursor: 'pointer',
        borderRadius: '8px',
        transition: 'background 0.2s ease',
        fontSize: '14px',
        fontWeight: 500,
        textAlign: 'left'
    },
    divider: {
        height: '1px',
        background: 'rgba(162, 89, 255, 0.2)',
        margin: '8px 0'
    },
    logoutButton: {
        color: '#FF5959'
    }
};

export default Header;