import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import User from './models/User.js';
import Project from './models/Project.js';
import Activity from './models/Activity.js';
import CheckIn from './models/CheckIn.js';
import { createAuthRoutes } from './routes/authRoutes.js';
import { createUserRoutes } from './routes/userRoutes.js';
import { createProjectRoutes } from './routes/projectRoutes.js';
import { createActivityRoutes } from './routes/activityRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// CORS middleware for development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Initialize database and models
let db;
let userModel;
let projectModel;
let activityModel;
let checkInModel;

async function initializeApp() {
    try {
        db = await connectDB();
        
        // Initialize models
        userModel = new User(db);
        projectModel = new Project(db);
        activityModel = new Activity(db);
        checkInModel = new CheckIn(db);

        // Setup routes
        app.use('/api/auth', createAuthRoutes(userModel));
        app.use('/api/users', createUserRoutes(userModel));
        app.use('/api/projects', createProjectRoutes(projectModel, activityModel, checkInModel));
        app.use('/api/activity', createActivityRoutes(activityModel, userModel));

        // Health check
        app.get('/api/health', (req, res) => {
            res.json({ status: 'ok', message: 'CodeVerse API is running' });
        });

        // Serve index.html for all other routes (SPA)
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log('🚀 CodeVerse server running at http://localhost:' + PORT);
            console.log('May the code be with you...');
        });
    } catch (error) {
        console.error('Failed to initialize app:', error);
        process.exit(1);
    }
}

initializeApp();