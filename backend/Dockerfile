# Production Dockerfile for Node.js Express Backend
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files from root build context
COPY package*.json ./

# Install dependencies (production only to optimize image size)
RUN npm ci --only=production

# Copy backend source files
COPY backend/ ./backend/

# Expose port (5000 as configured in backend/.env)
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start application
CMD ["node", "backend/server.js"]
