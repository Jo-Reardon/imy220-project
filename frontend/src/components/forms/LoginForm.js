import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/api.js';

function LoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) return setError('All fields are required');
        if (!formData.email.includes('@')) return setError('Please enter a valid email');

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
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                    <button type="submit">Engage Hyperdrive</button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
