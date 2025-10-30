import React, { useState } from 'react';
import { auth } from '../../utils/api.js';

function LoginForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await auth.login(formData.email, formData.password);
            // Session management: Store user in localStorage
            localStorage.setItem('user', JSON.stringify(result.user));
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <i className="fas fa-sign-in-alt text-5xl text-space-blue mb-4 inline-block"></i>
                <h2 className="text-3xl font-orbitron font-bold mb-2">Welcome Back</h2>
                <p className="text-sm opacity-70">Sign in to continue your mission</p>
            </div>

            {error && (
                <div className="bg-solar-red/20 border border-solar-red rounded-lg p-3 mb-5 text-solar-red text-center text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Email Field with Working Label */}
                <div className="flex flex-col gap-2">
                    <label 
                        htmlFor="login-email" 
                        className="font-semibold text-sm flex items-center gap-2 cursor-pointer hover:text-space-blue transition-colors"
                    >
                        <i className="fas fa-envelope"></i>
                        <span>Email Address</span>
                    </label>
                    <input
                        id="login-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full bg-cosmic-dark/60 border-2 border-nebula-purple/30 rounded-lg px-4 py-3 text-white text-sm focus:border-space-blue focus:outline-none transition-all"
                    />
                </div>

                {/* Password Field with Working Label */}
                <div className="flex flex-col gap-2">
                    <label 
                        htmlFor="login-password" 
                        className="font-semibold text-sm flex items-center gap-2 cursor-pointer hover:text-space-blue transition-colors"
                    >
                        <i className="fas fa-lock"></i>
                        <span>Password</span>
                    </label>
                    <input
                        id="login-password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                        className="w-full bg-cosmic-dark/60 border-2 border-nebula-purple/30 rounded-lg px-4 py-3 text-white text-sm focus:border-space-blue focus:outline-none transition-all"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-space-blue to-nebula-purple text-white px-4 py-4 rounded-lg text-base font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {loading ? (
                        <>
                            <i className="fas fa-spinner fa-spin"></i>
                            <span>Signing In...</span>
                        </>
                    ) : (
                        <>
                            <i className="fas fa-rocket"></i>
                            <span>Sign In</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default LoginForm;