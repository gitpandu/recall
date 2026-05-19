# --- Stage 1: Frontend Build ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Backend Build ---
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# --- Stage 3: Production Image ---
FROM node:20-alpine
WORKDIR /app

# Only copy production dependencies for the backend
COPY backend/package*.json ./backend/
RUN npm ci --prefix backend --omit=dev

# Copy compiled backend files
COPY --from=backend-builder /app/backend/dist ./backend/dist

# Copy frontend static assets
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Setup data directory and uploads
RUN mkdir -p /app/data /app/uploads

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Run the compiled javascript directly
CMD ["node", "backend/dist/index.js"]
