IMY 220 Project - CodeVerse Version Control Website

================================================================================
MONGODB ATLAS CONNECTION STRING
================================================================================
mongodb+srv://imy220:codeVerse@codeverse.0k5zwz5.mongodb.net/?retryWrites=true&w=majority&appName=codeVerse

================================================================================
BUILD AND RUN COMMANDS (Without Docker)
================================================================================

1. Install dependencies:
   npm install

2. Seed the database with test data:
   npm run seed

3. Build frontend and start server:
   npm start

4. Open browser to:
   http://localhost:3000

5. Test user credentials:
   Email: test@test.com
   Password: test1234

================================================================================
DOCKER COMMANDS
================================================================================

Build Docker image:
   docker build -t codeverse-app .

Run Docker container:
   docker run -p 3000:3000 codeverse-app

OR use Docker Compose:
   docker-compose up --build

Stop Docker Compose:
   docker-compose down

Access application:
   http://localhost:3000

================================================================================
DIRECTORY STRUCTURE
================================================================================

project-root/
├── frontend/
│   ├── public/
│   │   ├── index.html          # Main HTML file
│   │   ├── bundle.js           # Compiled React bundle
│   │   ├── styles/
│   │   │   └── style.css       # Global styles
│   │   └── assets/             # Images, fonts
│   └── src/
│       ├── index.js            # React entry point
│       ├── components/         # Reusable components
│       │   ├── Starfield.js
│       │   ├── Header.js
│       │   ├── ActivityFeed.js
│       │   ├── ProjectCard.js
│       │   └── forms/          # Form components
│       │       ├── LoginForm.js
│       │       └── RegisterForm.js
│       ├── pages/              # Page components
│       │   ├── SplashPage.js
│       │   ├── HomePage.js
│       │   └── ProfilePage.js
│       └── utils/
│           └── api.js          # API helper functions
│
├── backend/
│   ├── server.js               # Express server
│   ├── seed.js                 # Database seeding script
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── models/                 # Data models
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Activity.js
│   │   └── CheckIn.js
│   ├── controllers/            # Route handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   └── activityController.js
│   └── routes/                 # API routes
│       ├── authRoutes.js
│       ├── userRoutes.js
│       ├── projectRoutes.js
│       └── activityRoutes.js
│
├── .babelrc                    # Babel configuration
├── webpack.config.js           # Webpack configuration
├── package.json                # NPM dependencies
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose configuration
└── README.txt                  # This file

================================================================================
DATABASE COLLECTIONS
================================================================================

codeverse (database)
├── users           # User profiles (2 seeded)
├── projects        # Code projects (2 seeded)
├── checkins        # Check-in history (3 seeded)
└── activities      # Activity feed entries

================================================================================
API ENDPOINTS
================================================================================

Authentication:
  POST   /api/auth/register     - Register new user
  POST   /api/auth/login        - Login user
  POST   /api/auth/logout       - Logout user

Users:
  GET    /api/users/:username   - Get user profile
  PUT    /api/users/:userId     - Update profile
  DELETE /api/users/:userId     - Delete profile
  GET    /api/users/search?q=   - Search users
  POST   /api/users/friend-request
  POST   /api/users/accept-friend
  POST   /api/users/unfriend

Projects:
  GET    /api/projects/featured - Get all projects
  GET    /api/projects/:id      - Get single project
  POST   /api/projects          - Create project
  PUT    /api/projects/:id      - Update project
  DELETE /api/projects/:id      - Delete project
  GET    /api/projects/search?q=
  POST   /api/projects/:id/checkout
  POST   /api/projects/:id/checkin

Activity:
  GET    /api/activity?type=local&userId=
  GET    /api/activity?type=global
  GET    /api/activity/search?q=

Health Check:
  GET    /api/health            - Check API status

================================================================================
TESTING WITH POSTMAN/HOPPSCOTCH
================================================================================

1. Test login:
   POST http://localhost:3000/api/auth/login
   Body: {"email": "test@test.com", "password": "test1234"}

2. Test get projects:
   GET http://localhost:3000/api/projects/featured

3. Test search users:
   GET http://localhost:3000/api/users/search?q=Jo

================================================================================
TROUBLESHOOTING
================================================================================

If bundle.js is missing:
   npm run build

If database connection fails:
   - Check MongoDB Atlas connection string
   - Ensure IP whitelist includes your IP or 0.0.0.0/0
   - Verify username/password are correct

If Docker build fails:
   - Ensure Docker is running
   - Check that .dockerignore excludes node_modules
   - Try: docker system prune -a

Port already in use:
   - Kill process on port 3000: kill -9 $(lsof -ti:3000)
   - Or change PORT in docker-compose.yml

================================================================================
NOTES
================================================================================

- Passwords are NOT hashed (as per spec for testing purposes)
- MongoDB Atlas connection string must be updated before running
- Node.js version: 18+ required
- React Router handles client-side routing
- All API responses use JSON format
- CORS is enabled for development