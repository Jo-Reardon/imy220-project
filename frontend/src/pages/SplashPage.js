import React, { useState } from 'react';
import LoginForm from '../components/forms/LoginForm';
import RegisterForm from '../components/forms/RegisterForm';

function SplashPage() {
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div style={styles.container}>
            <div style={styles.logoSection}>
                <h1 style={styles.logo}>CodeVerse</h1>
                <p style={styles.tagline}>Collaborative Coding Across the Stars</p>
            </div>

            {!showRegister ? (
                <div style={styles.contentBox}>
                    <h2 style={styles.greeting}>Hello There</h2>
                    <p style={styles.subtext}>
                        Welcome to CodeVerse, the high ground of collaborative coding.
                    </p>
                    
                    <div style={styles.buttonGroup}>
                        <button 
                            style={styles.btnPrimary}
                            onClick={() => window.location.href = '/login'}
                        >
                            Log In
                        </button>
                        <button 
                            style={styles.btnSecondary}
                            onClick={() => setShowRegister(true)}
                        >
                            Join the CodeVerse
                        </button>
                    </div>
                </div>
            ) : (
                <RegisterForm onBack={() => setShowRegister(false)} />
            )}

            <p style={styles.footer}>
                A long time ago in a repo far, far away...
            </p>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px'
    },
    logoSection: {
        textAlign: 'center',
        marginBottom: '40px'
    },
    logo: {
        fontSize: '48px',
        margin: 0,
        background: 'linear-gradient(135deg, #0FF6FC, #A259FF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: 'Orbitron, sans-serif'
    },
    tagline: {
        fontSize: '14px',
        opacity: 0.8,
        marginTop: '8px'
    },
    contentBox: {
        background: 'rgba(15, 20, 50, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(162, 89, 255, 0.15)'
    },
    greeting: {
        fontSize: '42px',
        marginBottom: '16px',
        fontFamily: 'Orbitron, sans-serif'
    },
    subtext: {
        fontSize: '16px',
        marginBottom: '32px',
        opacity: 0.9
    },
    buttonGroup: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'center'
    },
    btnPrimary: {
        background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)',
        border: 'none',
        padding: '14px 32px',
        borderRadius: '8px',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '16px',
        fontWeight: 600,
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 0 20px rgba(15, 246, 252, 0.3)'
    },
    btnSecondary: {
        background: 'transparent',
        border: '2px solid #FF9A3C',
        padding: '14px 32px',
        borderRadius: '8px',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '16px',
        fontWeight: 600,
        color: '#FF9A3C',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    footer: {
        marginTop: '40px',
        fontSize: '14px',
        opacity: 0.6,
        fontStyle: 'italic'
    }
};

export default SplashPage;