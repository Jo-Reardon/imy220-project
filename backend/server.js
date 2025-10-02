// backend/server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Dummy data
const dummyUser = {
    username: 'YounglingSlayer66',
    name: 'Jo Reardon',
    email: 'test@test.com',
    avatar: 'https://via.placeholder.com/150',
    bio: "I don't push to production, I teleport."
};

const dummyActivities = [
    { user: 'Alice', action: 'checked in to "Nebulabort"', project: 'Refactor', time: '2h ago' },
    { user: 'Bob', action: 'created project', project: 'Starfield Sorter', time: '5h ago' }
];

const dummyProjects = [
    {
        _id: '1',
        name: 'Starfield Sorter',
        description: 'A sorting algorithm',
        languages: ['CSS', 'DataStructures', 'C08212'],
        lastUpdated: '3 days ago',
        checkedOut: false
    }
];

// Auth routes
app.post('/api/auth/login', (req, res) => {
    res.json({ success: true, user: dummyUser });
});

app.post('/api/auth/register', (req, res) => {
    res.json({ success: true, user: dummyUser });
});

// Activity routes
app.get('/api/activity', (req, res) => {
    res.json(dummyActivities);
});

// Project routes
app.get('/api/projects/featured', (req, res) => {
    res.json(dummyProjects);
});

// User routes
app.get('/api/users/:username', (req, res) => {
    res.json({ user: dummyUser, projects: dummyProjects });
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 CodeVerse server running at http://localhost:${PORT}`);
});
