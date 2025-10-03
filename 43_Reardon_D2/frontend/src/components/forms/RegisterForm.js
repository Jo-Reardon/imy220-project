import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/api.js';

function RegisterForm({ onBack }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreedToTerms: false
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreedToTerms) {
            newErrors.agreedToTerms = 'You must agree to the terms';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const data = await auth.register({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/home');
        } catch (err) {
            setErrors({ submit: err.message || 'Registration failed' });
        }
    };

    return (
        <div style={styles.formBox}>
            <h2 style={styles.title}>Register</h2>
            <p style={styles.subtitle}>So, you're joining the rebellion?</p>

            {errors.submit && (
                <div style={styles.error}>{errors.submit}</div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label htmlFor="username" style={styles.label}>Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="SkywalkerLuke"
                    />
                    {errors.username && <span style={styles.errorText}>{errors.username}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="rebel@alliance.com"
                    />
                    {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="password" style={styles.label}>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="••••••••"
                    />
                    {errors.password && <span style={styles.errorText}>{errors.password}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="••••••••"
                    />
                    {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
                </div>

                <div style={styles.checkboxGroup}>
                    <input
                        type="checkbox"
                        id="agreedToTerms"
                        name="agreedToTerms"
                        checked={formData.agreedToTerms}
                        onChange={handleChange}
                        style={styles.checkbox}
                    />
                    <label htmlFor="agreedToTerms" style={styles.checkboxLabel}>
                        I pledge allegiance to the CodeVerse
                    </label>
                </div>
                {errors.agreedToTerms && <span style={styles.errorText}>{errors.agreedToTerms}</span>}

                <button type="submit" style={styles.submitBtn}>
                    Launch
                </button>
            </form>

            <div style={styles.footer}>
                <a href="/login" style={styles.link}>Already a Jedi? Log In.</a>
            </div>
        </div>
    );
}

const styles = {
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
        marginBottom: '20px'
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
        fontFamily: 'Rajdhani, sans-serif'
    },
    errorText: {
        color: '#FF4B5C',
        fontSize: '14px',
        marginTop: '4px',
        display: 'block'
    },
    checkboxGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '24px'
    },
    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer'
    },
    checkboxLabel: {
        cursor: 'pointer',
        fontSize: '14px'
    },
    submitBtn: {
        width: '100%',
        background: 'linear-gradient(135deg, #FF9A3C, #FF6B35)',
        border: 'none',
        padding: '14px',
        borderRadius: '8px',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '16px',
        fontWeight: 600,
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 0 20px rgba(255, 154, 60, 0.3)'
    },
    footer: {
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '14px'
    },
    link: {
        color: '#0FF6FC',
        textDecoration: 'none'
    }
};

export default RegisterForm;
