# Use Node 20 LTS to match package requirements
FROM node:20-alpine

WORKDIR /app

# Copy package files for caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all application files
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "backend/server.js"]