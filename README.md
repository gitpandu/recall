# Recall

A personal, lightweight record-keeping application for managing custom databases/tables.

## Features

- **Custom Tables**: Create tables with customized names, descriptions, and accent colors. Toggle to pin tables for quick access.
- **Dynamic Columns/Properties**: Define field types for each table, including:
  - Text fields
  - Select dropdowns
  - Multi-select fields
  - Attachments
- **Row Records**: Add and edit entries within each table. Values are dynamically mapped based on your properties.
- **Attachments**: Upload and link files/images directly to table rows.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS (v3), Vite.
- **Backend**: Express, Node.js, TypeScript.
- **Database**: SQLite (via `@libsql/client`) managed via Drizzle ORM.
- **Uploads**: Local disk storage using `multer`.
- **Deployment**: Docker and Docker Compose support.

## Project Structure

- `storage/`: Unified storage for database and uploads.
- `frontend/`: React SPA user interface.
- `backend/`: Express server, Drizzle ORM schema, and database connection.

## Setup & Local Development

### Prerequisites

- Node.js (v20 or newer recommended)
- npm

### 1. Install Dependencies

In the root directory, run:

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

### 2. Run Database Migrations

Generate and run Drizzle migrations to set up the SQLite database schema:

```bash
npm run db:generate --prefix backend
npm run db:migrate --prefix backend
```

### 3. Run Development Servers

Run both the frontend and backend servers concurrently:

```bash
npm run dev
```

- **Frontend**: Running on http://localhost:5173
- **Backend**: Running on http://localhost:3000

Alternatively, you can run them individually:
- Frontend only: `npm run dev:frontend`
- Backend only: `npm run dev:backend`

---

## Docker Deployment

To run the entire application in a single production container using Docker:

### 1. Build and Run

```bash
docker compose up -d --build
```

- The app will build the frontend React assets and serve them statically through the Express backend on port `3000` (http://localhost:3000).

### 2. Data Persistence

The Docker container mounts a single named volume for persistent storage:
- `recall_storage` -> `/app/storage` (Contains `data/recall.db` and `uploads/` folder)

