# Events Web App (FastAPI + React + MUI)

This project includes:
- `backend`: FastAPI API with SQLAlchemy + SQLAdmin (admin panel).
- `frontend`: Vite + React + MUI app with:
  - `Афиша` tab with event posters
  - `Групповые занятия` tab with weekly timetable filters
  - detail pages for event and class cards

## Project structure

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
`-- frontend
    |-- src
    |   |-- App.jsx
    |   |-- main.jsx
    |   `-- styles.css
    |-- index.html
    |-- package.json
    `-- vite.config.js
```

## Backend setup (FastAPI + SQLAdmin)

1. Create and activate virtual environment:
   - Windows PowerShell:
     - `python -m venv .venv`
     - `.\.venv\Scripts\Activate.ps1`
2. Install dependencies:
   - `pip install -r backend/requirements.txt`
3. Run API server:
   - `uvicorn app.main:app --reload --app-dir backend`

Backend URLs:
- API docs: `http://localhost:8000/docs`
- Events API: `http://localhost:8000/api/events`
- Group classes API: `http://localhost:8000/api/group-classes`
- SQLAdmin panel: `http://localhost:8000/admin`

On first run, the app creates the database (`backend/app.db`) and seeds sample events and classes.
If you already launched an older version, delete `backend/app.db` once to reseed updated demo content.

## Frontend setup (Vite + React + MUI)

1. Install dependencies:
   - `cd frontend`
   - `npm install`
2. Run development server:
   - `npm run dev`

Frontend URL:
- `http://localhost:5173`

By default frontend reads data from `http://localhost:8000`.
You can override via env var:
- `VITE_API_BASE_URL`
