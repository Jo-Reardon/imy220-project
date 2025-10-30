import React, { useState } from 'react';
import { auth } from '../../utils/api.js';

function RegisterForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        bio: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error for this field
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            const result = await auth.register(
                formData.username,
                formData.email,
                formData.password,
                formData.name,
                formData.bio
            );
            // Session management: Store user in localStorage
            localStorage.setItem('user', JSON.stringify(result.user));
            if (onSuccess) onSuccess();
        } catch (err) {
            setErrors({ submit: err.message || 'Registration failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <i className="fas fa-user-plus text-5xl text-space-blue mb-4 inline-block"></i>
                <h2 className="text-3xl font-orbitron font-bold mb-2">Join CodeVerse</h2>
                <p className="text-sm opacity-70">Create your account and start coding</p>
            </div>

            {errors.submit && (
                <div className="bg-solar-red/20 border border-solar-red rounded-lg p-3 mb-5 text-solar-red text-center text-sm">
                    {errors.submit}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Username Field with Working Label */}
                <div className="flex flex-col gap-2">
                    <label 
                        htmlFor="register-username" 
                        className="font-semibold text-sm flex items-center gap-2 cursor-pointer hover:text-space-blue transition-colors"
                    >
                        <i className="fas fa-user"></i>
                        <span>Username *</span>
                    </label>
                    <input
                        id="register-username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Choose a username"
                        className="w-full bg-cosmic-dark/60 border-2 border-nebula-purple/30 rounded-lg px-4 py-3 text-white text-sm focus:border-space-blue focus:outline-none transition-all"
                    />
                    {errors.username && <span className="text-solar-red text-xs">{errors.username}</span>}
                </div>

                {/* Name Field with Working Label */}
                <div className="flex flex-col gap-2">
                    <label 
                        htmlFor="register-name" 
                        className="font-semibold text-sm flex items-center gap-2 cursor-pointer hover:text-space-blue transition-colors"
                    >
                        <i className="fas fa-id-card"></i>
                        <span>Full Name *</span>
                    </label>
                    <input
                        id="register-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="w-full bg-cosmic-dark/60 border-2 border-nebula-purple/30 rounded-lg px-4 py-3 text-white text-sm focus:border-space-blue focus:outline-none transition-all"
                    />
                    {errors.name && <span className="text-solar-red text-xs">{errors.name}</span>}
                </div>

                {/* Email Field with Working Label */}
                <div className="flex flex-col gap-2">
                    <label 
                        htmlFor="register-email" 
                        className="font-semibold text-sm flex items-center gap-2 cursor-pointer hover:text-space-blue transition-colors"
                    >
                        <i className="fas fa-envelope"></i>
                        <span>Email Address *</span>
                    </label>
                    <input
                        id="register-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full bg-cosmic-dark/60 border-2 border-nebula-purple/30 rounded-lg px-4 py-3 text-white text-sm focus:border-space-blue focus:outline-none transition-all"
                    />
                    {errors.email && <span className="text-solar-red text-xs">{errors.email}</span>}
                </div>

                {/* Password Field with Working Label */}
                <div className="flex flex-col gap-2">
                    <label 
                        htmlFor="register-password" 
                        className="font-semibold text-sm flex items-center gap-2 cursor-pointer hover:text-space-blue transition-colors"
                    >
                        <i className="fas fa-lock"></i>
                        <span>Password *</span>
                    </label>
                    <input
                        id="register-password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Minimum 6 characters"
                        className="w-full bg-cosmic-dark/60 border-2 border-nebula-purple/30 rounded-lg px-4 py-3 text-white text-sm focus:border-space-blue focus:outline-none transition-all"
                    />
                    {errors.password && <span className="text-solar-red text-xs">{errors.password}</span>}
                </div>

                {/* Confirm Password Field with Working Label */}
                <div className="flex flex-col gap-2">
                    <label 
                        htmlFor="register-confirm-password" 
                        className="font-semibold text-sm flex items-center gap-2 cursor-pointer hover:text-space-blue transition-colors"
                    >
                        <i className="fas fa-lock"></i>
                        <span>Confirm Password *</span>
                    </label>
                    <input
                        id="register-confirm-password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Re-enter password"
                        className="w-full bg-cosmic-dark/60 border-2 border-nebula-purple/30 rounded-lg px-4 py-3 text-white text-sm focus:border-space-blue focus:outline-none transition-all"
                    />
                    {errors.confirmPassword && <span className="text-solar-red text-xs">{errors.confirmPassword}</span>}
                </div>

                {/* Bio Field with Working Label (Optional) */}
                <div className="flex flex-col gap-2">
                    <label 
                        htmlFor="register-bio" 
                        className="font-semibold text-sm flex items-center gap-2 cursor-pointer hover:text-space-blue transition-colors"
                    >
                        <i className="fas fa-comment"></i>
                        <span>Bio (Optional)</span>
                    </label>
                    <textarea
                        id="register-bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        rows="3"
                        className="w-full bg-cosmic-dark/60 border-2 border-nebula-purple/30 rounded-lg px-4 py-3 text-white text-sm focus:border-space-blue focus:outline-none transition-all resize-none"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-stellar-orange to-solar-red text-white px-4 py-4 rounded-lg text-base font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {loading ? (
                        <>
                            <i className="fas fa-spinner fa-spin"></i>
                            <span>Creating Account...</span>
                        </>
                    ) : (
                        <>
                            <i className="fas fa-rocket"></i>
                            <span>Create Account</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default RegisterForm;