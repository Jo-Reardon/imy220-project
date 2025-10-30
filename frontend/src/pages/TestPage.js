import React, { useState } from 'react';
import { auth, users, projects, activity } from '../utils/api.js';

function TestPage() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const log = (test, success, data) => {
        setResults(prev => [...prev, { test, success, data, time: new Date().toLocaleTimeString() }]);
    };

    const runTest = async (name, testFn) => {
        setLoading(true);
        try {
            const result = await testFn();
            log(name, true, result);
        } catch (error) {
            log(name, false, error.message);
        }
        setLoading(false);
    };

    const tests = {
        // Auth Tests
        testRegister: async () => {
            const testUser = {
                username: `testuser_${Date.now()}`,
                email: `test_${Date.now()}@test.com`,
                password: 'test1234'
            };
            return await auth.register(testUser);
        },
        
        testLogin: async () => {
            return await auth.login({ email: 'test@test.com', password: 'test1234' });
        },

        // Profile Tests
        testGetProfile: async () => {
            return await users.getProfile('YounglingSlayer66');
        },

        testUpdateProfile: async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error('Must be logged in');
            return await users.updateProfile(user._id, { bio: 'Updated bio at ' + new Date().toLocaleTimeString() });
        },

        testSearchUsers: async () => {
            return await users.search('Jo');
        },

        // Project Tests
        testGetProjects: async () => {
            return await projects.getFeatured();
        },

        testCreateProject: async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error('Must be logged in');
            
            return await projects.create({
                name: `Test Project ${Date.now()}`,
                description: 'A test project for validation',
                ownerId: user._id,
                ownerUsername: user.username,
                languages: ['JavaScript', 'React'],
                type: 'Web Application',
                version: '1.0.0',
                files: [{ name: 'test.js', content: 'console.log("test")' }]
            });
        },

        testSearchProjects: async () => {
            return await projects.search('Star');
        },

        testCheckout: async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error('Must be logged in');
            
            const allProjects = await projects.getFeatured();
            if (allProjects.length === 0) throw new Error('No projects to checkout');
            
            return await projects.checkout(allProjects[0]._id, user._id, user.username);
        },

        testCheckin: async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error('Must be logged in');
            
            const allProjects = await projects.getFeatured();
            const checkedOut = allProjects.find(p => p.checkedOutBy === user._id);
            
            if (!checkedOut) throw new Error('No project checked out by you');
            
            return await projects.checkin(
                checkedOut._id,
                user._id,
                user.username,
                [{ name: 'updated.js', content: 'console.log("updated")' }],
                'Test check-in message',
                '1.0.1'
            );
        },

        // Activity Tests
        testGlobalActivity: async () => {
            return await activity.getFeed('global');
        },

        testLocalActivity: async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) throw new Error('Must be logged in');
            return await activity.getFeed('local', user._id);
        },

        testSearchActivity: async () => {
            return await activity.search('commit');
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>API Test Page</h1>
            
            <div style={styles.buttonGrid}>
                <button onClick={() => runTest('Register New User', tests.testRegister)} style={styles.button}>
                    Test Register
                </button>
                <button onClick={() => runTest('Login', tests.testLogin)} style={styles.button}>
                    Test Login
                </button>
                <button onClick={() => runTest('Get Profile', tests.testGetProfile)} style={styles.button}>
                    Test Get Profile
                </button>
                <button onClick={() => runTest('Update Profile', tests.testUpdateProfile)} style={styles.button}>
                    Test Update Profile
                </button>
                <button onClick={() => runTest('Search Users', tests.testSearchUsers)} style={styles.button}>
                    Test Search Users
                </button>
                <button onClick={() => runTest('Get Projects', tests.testGetProjects)} style={styles.button}>
                    Test Get Projects
                </button>
                <button onClick={() => runTest('Create Project', tests.testCreateProject)} style={styles.button}>
                    Test Create Project
                </button>
                <button onClick={() => runTest('Search Projects', tests.testSearchProjects)} style={styles.button}>
                    Test Search Projects
                </button>
                <button onClick={() => runTest('Checkout Project', tests.testCheckout)} style={styles.button}>
                    Test Checkout
                </button>
                <button onClick={() => runTest('Checkin Project', tests.testCheckin)} style={styles.button}>
                    Test Checkin
                </button>
                <button onClick={() => runTest('Global Activity', tests.testGlobalActivity)} style={styles.button}>
                    Test Global Activity
                </button>
                <button onClick={() => runTest('Local Activity', tests.testLocalActivity)} style={styles.button}>
                    Test Local Activity
                </button>
                <button onClick={() => runTest('Search Activity', tests.testSearchActivity)} style={styles.button}>
                    Test Search Activity
                </button>
            </div>

            {loading && <p style={styles.loading}>Running test...</p>}

            <div style={styles.results}>
                <h2 style={styles.subtitle}>Test Results</h2>
                {results.map((result, index) => (
                    <div key={index} style={result.success ? styles.resultSuccess : styles.resultError}>
                        <strong>{result.time}</strong> - {result.test}: {' '}
                        {result.success ? '✅ SUCCESS' : '❌ FAILED'}
                        <pre style={styles.data}>
                            {JSON.stringify(result.data, null, 2)}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    title: {
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '32px',
        marginBottom: '20px',
        textAlign: 'center'
    },
    subtitle: {
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '24px',
        marginBottom: '16px'
    },
    buttonGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '40px'
    },
    button: {
        background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)',
        border: 'none',
        padding: '12px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 600,
        cursor: 'pointer',
        fontSize: '14px'
    },
    loading: {
        textAlign: 'center',
        fontSize: '18px',
        marginBottom: '20px'
    },
    results: {
        marginTop: '20px'
    },
    resultSuccess: {
        background: 'rgba(16, 185, 129, 0.2)',
        border: '1px solid #10b981',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px'
    },
    resultError: {
        background: 'rgba(239, 68, 68, 0.2)',
        border: '1px solid #ef4444',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px'
    },
    data: {
        marginTop: '8px',
        fontSize: '12px',
        overflow: 'auto',
        maxHeight: '200px'
    }
};

export default TestPage;