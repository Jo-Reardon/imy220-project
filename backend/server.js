import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import User from './models/User.js';
import Project from './models/Project.js';
import Activity from './models/Activity.js';
import CheckIn from './models/CheckIn.js';
import Discussion from './models/Discussion.js';
import { createAuthRoutes } from './routes/authRoutes.js';
import { createUserRoutes } from './routes/userRoutes.js';
import { createProjectRoutes } from './routes/projectRoutes.js';
import { createActivityRoutes } from './routes/activityRoutes.js';
import { createDiscussionRoutes } from './routes/discussionRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Connect to database and initialize routes
connectDB().then(db => {
    const userModel = new User(db);
    const projectModel = new Project(db);
    const activityModel = new Activity(db);
    const checkInModel = new CheckIn(db);
    const discussionModel = new Discussion(db);

    // API Routes
    app.use('/api/auth', createAuthRoutes(userModel));
    app.use('/api/users', createUserRoutes(userModel));
    app.use('/api/projects', createProjectRoutes(projectModel, activityModel, checkInModel));
    app.use('/api/activity', createActivityRoutes(activityModel, userModel));
    app.use('/api/projects', createDiscussionRoutes(discussionModel));

    // Health check
    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok' });
    });

    // Serve React app for all other routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
});