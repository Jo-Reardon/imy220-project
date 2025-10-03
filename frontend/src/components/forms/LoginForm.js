import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/api.js';

function LoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (!formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            const data = await auth.login(formData);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/home');
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formBox}>
                <h2 style={styles.title}>Log In</h2>
                <p style={styles.subtitle}>Welcome back, Commander!</p>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>
                            Email/Username
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="your.email@galaxy.com"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" style={styles.submitBtn}>
                        Engage Hyperdrive
                    </button>
                </form>

                <div style={styles.footer}>
                    <a href="/forgot-password" style={styles.link}>Forgot Password?</a>
                    <span style={styles.separator}>|</span>
                    <a href="/" style={styles.link}>New cadet? Register Now!</a>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px'
    },
    formBox: {
        background: 'rgba(15, 20, 50, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(162, 89, 255, 0.15)'
    },
    title: {
        fontSize: '36px',
        marginBottom: '8px',
        textAlign: 'center',
        fontFamily: 'Orbitron, sans-serif'
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: '32px',
        opacity: 0.8
    },
    error: {
        background: 'rgba(239, 68, 68, 0.2)',
        border: '1px solid #FF4B5C',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '20px',
        color: '#FF4B5C',
        textAlign: 'center'
    },
    formGroup: {
        marginBottom: '24px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 500
    },
    input: {
        width: '100%',
        background: 'rgba(11, 15, 43, 0.6)',
        border: '2px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '8px',
        padding: '12px 16px',
        color: '#EDEDED',
        fontSize: '16px',
        fontFamily: 'Rajdhani, sans-serif',
        transition: 'all 0.3s ease'
    },
    submitBtn: {
        width: '100%',
        background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)',
        border: 'none',
        padding: '14px',
        borderRadius: '8px',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '16px',
        fontWeight: 600,
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 0 20px rgba(15, 246, 252, 0.3)',
        marginTop: '8px'
    },
    footer: {
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '14px'
    },
    link: {
        color: '#0FF6FC',
        textDecoration: 'none'
    },
    separator: {
        margin: '0 12px',
        opacity: 0.5
    }
};

export default LoginForm;
