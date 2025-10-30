import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm.js';
import RegisterForm from '../components/forms/RegisterForm.js';

function SplashPage() {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        // Session Management: Check if user is already logged in
        const user = localStorage.getItem('user');
        if (user) {
            navigate('/home');
            return;
        }

        // Parallax scroll effect
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [navigate]);

    const handleLoginSuccess = () => {
        navigate('/home');
    };

    const handleRegisterSuccess = () => {
        navigate('/home');
    };

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* Hero Section with Parallax */}
            <section 
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
                style={{ transform: `translateY(${scrollY * 0.5}px)` }}
            >
                {/* Animated Stars Background */}
                <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ transform: `translateY(${scrollY * 0.3}px)` }}
                >
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={`star-${i}`}
                            className={`star absolute animate-twinkle ${
                                i % 3 === 0 ? 'star-large' : i % 2 === 0 ? 'star-medium' : 'star-small'
                            }`}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div 
                        className="mb-10"
                        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
                    >
                        <i className="fas fa-rocket text-8xl gradient-text mb-6 inline-block animate-float"></i>
                        <h1 className="text-6xl md:text-8xl font-orbitron font-bold mb-4 gradient-text drop-shadow-[0_0_40px_rgba(15,246,252,0.3)]">
                            CodeVerse
                        </h1>
                        <p className="text-xl md:text-3xl opacity-90 font-light">
                            Collaborative Coding Across the Stars
                        </p>
                    </div>

                    <p className="text-lg md:text-xl leading-relaxed opacity-80 mb-12 max-w-2xl mx-auto">
                        Join a galaxy of developers building the future, one commit at a time. 
                        Collaborate on projects, manage versions, and connect with your coding crew.
                    </p>

                    <div className="flex flex-wrap gap-5 justify-center mb-16">
                        <button 
                            onClick={() => setShowRegister(true)}
                            className="bg-gradient-to-r from-stellar-orange to-solar-red text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_8px_24px_rgba(255,154,60,0.3)] hover-glow"
                        >
                            <i className="fas fa-rocket"></i>
                            <span>Launch Your Journey</span>
                        </button>
                        <button 
                            onClick={() => setShowLogin(true)}
                            className="bg-transparent border-2 border-space-blue text-space-blue px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-3 hover:bg-space-blue hover:text-cosmic-dark transition-all"
                        >
                            <i className="fas fa-sign-in-alt"></i>
                            <span>Sign In</span>
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-2 opacity-60 animate-bounce-slow">
                        <i className="fas fa-chevron-down text-2xl"></i>
                        <span className="text-sm">Discover More</span>
                    </div>
                </div>
            </section>

            {/* Purpose Section - Clearly indicates website purpose */}
            <section 
                className="py-20 px-4 bg-deep-space/50 backdrop-blur-custom"
                style={{ transform: `translateY(${scrollY * 0.15}px)` }}
            >
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-6 gradient-text">
                        What is CodeVerse?
                    </h2>
                    <p className="text-lg md:text-xl text-center opacity-80 max-w-3xl mx-auto leading-relaxed mb-12">
                        CodeVerse is a <strong className="text-space-blue">collaborative project management platform</strong> designed 
                        for developers.Create, manage, and version control your projects while connecting with a community of coders from around the world.
                    </p>
                {/* Key Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-deep-space/80 backdrop-blur-custom border border-nebula-purple/30 rounded-2xl p-8 feature-card">
                        <div className="text-5xl gradient-text mb-4">
                            <i className="fas fa-code-branch"></i>
                        </div>
                        <h3 className="text-xl font-orbitron font-semibold mb-3">Version Control</h3>
                        <p className="opacity-80 leading-relaxed">
                            Built-in check-in/check-out system with full version tracking for seamless collaboration.
                        </p>
                    </div>

                    <div className="bg-deep-space/80 backdrop-blur-custom border border-nebula-purple/30 rounded-2xl p-8 feature-card">
                        <div className="text-5xl gradient-text mb-4">
                            <i className="fas fa-users"></i>
                        </div>
                        <h3 className="text-xl font-orbitron font-semibold mb-3">Team Collaboration</h3>
                        <p className="opacity-80 leading-relaxed">
                            Connect with developers, build teams, and work together on stellar projects.
                        </p>
                    </div>

                    <div className="bg-deep-space/80 backdrop-blur-custom border border-nebula-purple/30 rounded-2xl p-8 feature-card">
                        <div className="text-5xl gradient-text mb-4">
                            <i className="fas fa-project-diagram"></i>
                        </div>
                        <h3 className="text-xl font-orbitron font-semibold mb-3">Project Management</h3>
                        <p className="opacity-80 leading-relaxed">
                            Organize your code, track progress, and manage multiple projects effortlessly.
                        </p>
                    </div>

                    <div className="bg-deep-space/80 backdrop-blur-custom border border-nebula-purple/30 rounded-2xl p-8 feature-card">
                        <div className="text-5xl gradient-text mb-4">
                            <i className="fas fa-comments"></i>
                        </div>
                        <h3 className="text-xl font-orbitron font-semibold mb-3">Discussion Boards</h3>
                        <p className="opacity-80 leading-relaxed">
                            Share ideas, ask questions, and collaborate in real-time with your crew.
                        </p>
                    </div>

                    <div className="bg-deep-space/80 backdrop-blur-custom border border-nebula-purple/30 rounded-2xl p-8 feature-card">
                        <div className="text-5xl gradient-text mb-4">
                            <i className="fas fa-search"></i>
                        </div>
                        <h3 className="text-xl font-orbitron font-semibold mb-3">Discover Projects</h3>
                        <p className="opacity-80 leading-relaxed">
                            Explore the galaxy of projects and find your next coding adventure.
                        </p>
                    </div>

                    <div className="bg-deep-space/80 backdrop-blur-custom border border-nebula-purple/30 rounded-2xl p-8 feature-card">
                        <div className="text-5xl gradient-text mb-4">
                            <i className="fas fa-stream"></i>
                        </div>
                        <h3 className="text-xl font-orbitron font-semibold mb-3">Activity Feeds</h3>
                        <p className="opacity-80 leading-relaxed">
                            Stay updated with your crew's activities and project developments.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 bg-cosmic-dark/80">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-16 flex items-center justify-center gap-4">
                    <i className="fas fa-map text-space-blue"></i>
                    <span className="gradient-text">How It Works</span>
                </h2>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6">
                    {/* Step 1 */}
                    <div className="flex-1 flex items-center gap-5 bg-deep-space/80 backdrop-blur-custom border border-nebula-purple/30 rounded-2xl p-8 min-w-[280px]">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-space-blue to-nebula-purple flex items-center justify-center text-3xl font-bold font-orbitron flex-shrink-0">
                            1
                        </div>
                        <div>
                            <h3 className="text-xl font-orbitron font-semibold mb-2">Create Your Profile</h3>
                            <p className="text-sm opacity-80">Sign up and join the CodeVerse community.</p>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-3xl text-space-blue/50 hidden lg:block">
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="text-3xl text-space-blue/50 lg:hidden rotate-90">
                        <i className="fas fa-arrow-right"></i>
                    </div>

                    {/* Step 2 */}
                    <div className="flex-1 flex items-center gap-5 bg-deep-space/80 backdrop-blur-custom border border-nebula-purple/30 rounded-2xl p-8 min-w-[280px]">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-space-blue to-nebula-purple flex items-center justify-center text-3xl font-bold font-orbitron flex-shrink-0">
                            2
                        </div>
                        <div>
                            <h3 className="text-xl font-orbitron font-semibold mb-2">Start a Project</h3>
                            <p className="text-sm opacity-80">Create projects and invite team members.</p>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-3xl text-space-blue/50 hidden lg:block">
                        <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="text-3xl text-space-blue/50 lg:hidden rotate-90">
                        <i className="fas fa-arrow-right"></i>
                    </div>

                    {/* Step 3 */}
                    <div className="flex-1 flex items-center gap-5 bg-deep-space/80 backdrop-blur-custom border border-nebula-purple/30 rounded-2xl p-8 min-w-[280px]">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-space-blue to-nebula-purple flex items-center justify-center text-3xl font-bold font-orbitron flex-shrink-0">
                            3
                        </div>
                        <div>
                            <h3 className="text-xl font-orbitron font-semibold mb-2">Collaborate & Build</h3>
                            <p className="text-sm opacity-80">Work together and ship amazing code.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-space-blue/10 to-nebula-purple/10 text-center">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6">
                    Ready to Join the Mission?
                </h2>
                <p className="text-lg md:text-xl opacity-80 mb-10 leading-relaxed">
                    Start collaborating with developers from across the galaxy today.
                </p>
                <button 
                    onClick={() => setShowRegister(true)}
                    className="bg-gradient-to-r from-stellar-orange to-solar-red text-white px-10 py-5 rounded-xl text-xl font-semibold inline-flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_8px_24px_rgba(255,154,60,0.4)]"
                >
                    <i className="fas fa-rocket"></i>
                    <span>Get Started Free</span>
                </button>
            </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-4 bg-cosmic-dark/95 border-t border-nebula-purple/30">
            <div className="max-w-6xl mx-auto text-center">
                <div className="flex items-center justify-center gap-3 text-2xl font-orbitron mb-4">
                    <i className="fas fa-rocket text-space-blue"></i>
                    <span>CodeVerse</span>
                </div>
                <p className="opacity-70 mb-4">
                    Built for developers, by developers. © 2025 CodeVerse
                </p>
                <div className="flex items-center justify-center gap-4">
                    <button 
                        onClick={() => setShowLogin(true)}
                        className="text-space-blue hover:underline text-sm"
                    >
                        Sign In
                    </button>
                    <span className="opacity-30">|</span>
                    <button 
                        onClick={() => setShowRegister(true)}
                        className="text-space-blue hover:underline text-sm"
                    >
                        Register
                    </button>
                </div>
            </div>
        </footer>

        {/* Login Modal */}
        {showLogin && (
            <div 
                className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setShowLogin(false)}
            >
                <div 
                    className="bg-deep-space/95 backdrop-blur-custom border border-nebula-purple/30 rounded-2xl p-10 max-w-md w-full max-h-[90vh] overflow-y-auto relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setShowLogin(false)}
                        className="absolute top-5 right-5 text-solar-red text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-solar-red/20 transition-all"
                        aria-label="Close login form"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                    <LoginForm onSuccess={handleLoginSuccess} />
                    <p className="text-center mt-6 text-sm opacity-80">
                        Don't have an account?{' '}
                        <button 
                            onClick={() => {
                                setShowLogin(false);
                                setShowRegister(true);
                            }}
                            className="text-space-blue underline hover:text-nebula-purple transition-colors"
                        >
                            Register here
                        </button>
                    </p>
                </div>
            </div>
        )}

        {/* Register Modal */}
        {showRegister && (
            <div 
                className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setShowRegister(false)}
            >
                <div 
                    className="bg-deep-space/95 backdrop-blur-custom border border-nebula-purple/30 rounded-2xl p-10 max-w-md w-full max-h-[90vh] overflow-y-auto relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setShowRegister(false)}
                        className="absolute top-5 right-5 text-solar-red text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-solar-red/20 transition-all"
                        aria-label="Close registration form"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                    <RegisterForm onSuccess={handleRegisterSuccess} />
                    <p className="text-center mt-6 text-sm opacity-80">
                        Already have an account?{' '}
                        <button 
                            onClick={() => {
                                setShowRegister(false);
                                setShowLogin(true);
                            }}
                            className="text-space-blue underline hover:text-nebula-purple transition-colors">
                            Sign in here
                        </button>
                    </p>
                </div>
            </div>
        )}
    </div>
);
}
export default SplashPage;