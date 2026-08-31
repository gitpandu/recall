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

- `app/frontend/`: React SPA user interface.
- `app/backend/`: Express server, Drizzle ORM schema, and database connection.
- `data/`: SQLite database (`recall.db`) and uploaded files (`uploads/`).

## Setup & Local Development

### Prerequisites

- Node.js (v20 or newer recommended)
- npm

### 1. Install Dependencies

In the `app` directory, run:

```bash
cd app
npm install
npm install --prefix frontend
npm install --prefix backend
```

### 2. Database Setup

The SQLite database is initialized automatically on the first run of the application.

### 3. Run Development Servers

From `app/`, run both the frontend and backend servers concurrently:

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

The container bind-mounts the host `data/` folder:
- `./data` -> `/app/data` (contains `recall.db` and `uploads/`)
