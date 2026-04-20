# LawPal

AI‑powered legal assistant for Indian law with RAG search, chat, and Mini Court simulation.

## Structure
- `frontend/` — Vite + React UI
- `server/` — Node/Express API
- `LawPal-Backend/` — Flask RAG backend

## Quick Start (Local)
```bash
# Frontend
cd frontend
npm install
npm run dev
```

```bash
# Node API
cd server
npm install
node server.js
```

```bash
# RAG Backend
cd LawPal-Backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Environment
- Frontend: `VITE_API_BASE_URL` in `frontend/.env`
- Server: `MONGODB_URI`, `JWT_SECRET`, `GROQ_API_KEYS`, `FLASK_BACKEND_URL` in `server/.env`
- RAG: `GROQ_API_KEYS` in `LawPal-Backend/.env`

## Notes
- RAG endpoint: `POST /query`
- See `DEPLOYMENT_CHECKLIST.md` for production setup.
