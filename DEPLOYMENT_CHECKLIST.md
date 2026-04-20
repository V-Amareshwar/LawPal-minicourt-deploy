# Deployment Checklist

## Frontend (Vite)
- [ ] Set `VITE_API_BASE_URL` to your production API URL
- [ ] Run `npm run build`
- [ ] Serve `frontend/dist` via CDN or static host

## Node API (server)
- [ ] Set `PORT`, `MONGODB_URI`, `JWT_SECRET`, `GROQ_API_KEYS`, `GROQ_BASE_URL`, `FLASK_BACKEND_URL`
- [ ] Set `ALLOWED_ORIGINS` to production frontend URL(s)
- [ ] Run `npm install` and `npm start`
- [ ] Configure reverse proxy timeouts (recommend >= 120s)

## RAG Backend (LawPal-Backend)
- [ ] Set `GROQ_API_KEYS`, `PORT`, `DEBUG=false`
- [ ] Ensure `chroma_db/`, `bm25_index.pkl`, `processed_legal_data.json` are present
- [ ] Use a stable Python environment (venv/conda)
- [ ] Run `python app.py` (exposes `/query`)

## Networking
- [ ] API reachable from frontend
- [ ] RAG reachable from Node server
- [ ] HTTPS enabled for production

## Smoke Tests
- [ ] Login works
- [ ] Chatbot returns RAG response
- [ ] Mini Court returns result
