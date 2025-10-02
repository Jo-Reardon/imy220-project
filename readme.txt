IMY 220 Project - Version Control Website

BUILD COMMANDS:
1. Install dependencies: npm install
2. Build frontend: npm run build
3. Build and start server: npm start

For development with auto-rebuild:
- Run in separate terminal: npm run build:watch
- Run server: npm run server:build && node dist/server.js

DIRECTORY STRUCTURE:
- /frontend: React frontend application
  - /public: Static files and compiled bundle
  - /src: React source code
    - /components: Reusable components
    - /pages: Page-level components
    - /utils: Helper functions
- /backend: Node.js/Express backend
  - /models: MongoDB schemas
  - /routes: API routes
  - /controllers: Route handlers
  - /config: Configuration files

Docker: Use docker-compose up to run the application