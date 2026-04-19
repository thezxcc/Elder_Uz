# ElderUZ (FastAPI + React + MUI)

ElderUZ is a web app for older adults.
It includes:
- event listings;
- group classes;
- detailed cards with contacts and multilingual fields (RU/UZ/EN);
- an admin panel for content management.

## Current Runtime Versions

Verified in this project environment:
- Python: `3.14.3`
- Node.js: `24.14.1`
- npm: `11.11.0`

Recommended minimum:
- Python `>= 3.12`
- Node.js `>= 20`

## Tech Stack and Dependencies

### Backend (`backend/requirements.txt`)
- `fastapi==0.116.1`
- `uvicorn[standard]==0.35.0`
- `sqlalchemy==2.0.38`
- `sqladmin==0.20.1`

### Frontend (`frontend/package.json`)
Main dependencies:
- `react` `^18.3.1`
- `react-dom` `^18.3.1`
- `@mui/material` `^5.16.14`
- `@mui/icons-material` `^5.16.14`
- `@emotion/react` `^11.14.0`
- `@emotion/styled` `^11.14.0`

Dev dependencies:
- `vite` `^5.4.10`
- `@vitejs/plugin-react` `^4.3.1`

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
`-- app.db
```

## Setup and Run

Run the commands below from the project root directory.

### 1) Backend (FastAPI)

#### Windows (PowerShell)
```powershell
py -3.14 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
uvicorn app.main:app --reload --app-dir backend --host 127.0.0.1 --port 8000
```

#### macOS (Terminal / zsh)
```bash
python3.14 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
uvicorn app.main:app --reload --app-dir backend --host 127.0.0.1 --port 8000
```

If `python3.14` is not installed, use `python3`.

### 2) Frontend (Vite + React)

#### Windows (PowerShell)
```powershell
cd frontend
npm install
npm run dev
```

#### macOS (Terminal / zsh)
```bash
cd frontend
npm install
npm run dev
```

## URLs After Startup

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- SQLAdmin panel: `http://localhost:8000/admin`

## Important Behavior

- The app **does not auto-create demo data** on first launch.
- You should add content manually via the admin panel (`/admin`).
- The frontend uses `http://localhost:8000` by default.

Optional environment variable:
- `VITE_API_BASE_URL`

## Common Issues

### `npm ERR! enoent Could not read package.json`
You are running npm outside the `frontend` directory.
Fix: run `cd frontend` and repeat the command.

### `ERR_CONNECTION_REFUSED` on `localhost:8000`
The backend is not running, or it is running on a different port.
Fix: check the terminal where `uvicorn` is running and confirm port `8000`.

### Port already in use
Run services on different ports:
- backend: `--port 8001`
- frontend: `npm run dev -- --port 5174`
