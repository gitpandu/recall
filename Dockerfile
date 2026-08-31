# --- Stage 1: Frontend Build ---
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
# Use npm ci for faster, more reliable builds
COPY app/frontend/package*.json ./
RUN npm ci
COPY app/frontend/ ./
RUN npm run build

# --- Stage 2: Backend Build ---
FROM node:22-alpine AS backend-builder
WORKDIR /app/backend
COPY app/backend/package*.json ./
RUN npm ci
COPY app/backend/ ./
RUN npm run build

# --- Stage 3: Production Image ---
FROM node:22-alpine
WORKDIR /app

# Only copy production dependencies for the backend
COPY app/backend/package*.json ./backend/
RUN npm ci --prefix backend --omit=dev

# Copy compiled backend files
COPY --from=backend-builder /app/backend/dist ./backend/dist

# Copy frontend static assets
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Setup data directory
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=3000
ENV STORAGE_PATH=/app/data

EXPOSE 3000

# Run the compiled javascript directly
CMD ["node", "backend/dist/index.js"]
