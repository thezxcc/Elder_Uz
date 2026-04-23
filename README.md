# ElderUZ

**ElderUZ** is a community platform for older adults in Uzbekistan.
It helps seniors discover local events, join group classes, and stay socially connected through a clean, multilingual, and mobile-first experience.

## Why ElderUZ

Many seniors face barriers when trying to find meaningful social activities online.
ElderUZ addresses this with:

- large, readable, senior-friendly interface;
- one place for events, classes, and organizer contacts;
- multilingual content support in Russian, Uzbek, and English;
- simple admin workflow for updating community information.

## Core Features

- Event feed with detailed event cards
- Group classes with category filtering
- Nearby tab with district-based browsing
- Search by title, place, organizer, and category
- Multilingual UI and multilingual content fields
- SQLAdmin panel for full content management

## Architecture Overview

- **Frontend**: React + Vite + MUI
- **Backend**: FastAPI + SQLAlchemy
- **Admin Panel**: SQLAdmin
- **Database**: SQLite (`app.db`)

## Project Structure

```text
.
|-- backend
|   |-- app
|   |   |-- admin.py
|   |   |-- database.py
|   |   |-- main.py
|   |   |-- models.py
|   |   `-- schemas.py
|   `-- requirements.txt
|-- frontend
|   |-- src
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- styles.css
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
|-- docs
|   `-- media
|       `-- elderuz-demo-short.gif
`-- app.db
```

## Runtime and Requirements

Verified environment:
- Python `3.14.3`
- Node.js `24.14.1`
- npm `11.11.0`

Recommended minimum:
- Python `>= 3.12`
- Node.js `>= 20`

## Dependencies

### Backend (`backend/requirements.txt`)
- `fastapi==0.116.1`
- `uvicorn[standard]==0.35.0`
- `sqlalchemy==2.0.38`
- `sqladmin==0.20.1`

### Frontend (`frontend/package.json`)
Main:
- `react` `^18.3.1`
- `react-dom` `^18.3.1`
- `@mui/material` `^5.16.14`
- `@mui/icons-material` `^5.16.14`
- `@emotion/react` `^11.14.0`
- `@emotion/styled` `^11.14.0`

Dev:
- `vite` `^5.4.10`
- `@vitejs/plugin-react` `^4.3.1`

## Quick Start

Run commands from project root.

### Backend

Windows (PowerShell):
```powershell
py -3.14 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
uvicorn app.main:app --reload --app-dir backend --host 127.0.0.1 --port 8000
```

macOS (zsh):
```bash
python3.14 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
uvicorn app.main:app --reload --app-dir backend --host 127.0.0.1 --port 8000
```

### Frontend

Windows and macOS:
```bash
cd frontend
npm install
npm run dev
```

## Local URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- Swagger Docs: `http://localhost:8000/docs`
- SQLAdmin: `http://localhost:8000/admin`

## API Endpoints

- `GET /api/health`
- `GET /api/events`
- `GET /api/group-classes`

## Data and Admin Notes

- Demo data is **not** auto-created on first launch.
- Content is managed through SQLAdmin (`/admin`).
- `created_at` is preserved for traceability.

## Configuration

Frontend default API base URL: `http://localhost:8000`

Optional env var:
- `VITE_API_BASE_URL`

## Troubleshooting

### `npm ERR! enoent Could not read package.json`
You are running npm outside `frontend`.
Fix:
```bash
cd frontend
```

### `ERR_CONNECTION_REFUSED` on `localhost:8000`
Backend is not running or is on another port.
Fix: check your `uvicorn` terminal and port configuration.

### Port already in use
Use custom ports:
- backend: `--port 8001`
- frontend: `npm run dev -- --port 5174`
