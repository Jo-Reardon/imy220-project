import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/api.js';

function RegisterForm({ onBack }) {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', agreedToTerms: false });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Username required';
        if (!formData.email.includes('@')) newErrors.email = 'Invalid email';
        if (formData.password.length < 6) newErrors.password = 'Password too short';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
        if (!formData.agreedToTerms) newErrors.agreedToTerms = 'Agree to terms';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length) return setErrors(validationErrors);

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
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" />
            <label>
                <input type="checkbox" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleChange} />
                I agree to CodeVerse
            </label>
            <button type="submit">Launch</button>
            {errors.submit && <div>{errors.submit}</div>}
        </form>
    );
}

export default RegisterForm;
