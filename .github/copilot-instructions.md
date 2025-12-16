# Copilot / AI Agent Instructions

Purpose: provide concise, actionable guidance so an AI coding agent can be immediately productive in this repo.

- Project type: Vite + React (TypeScript) frontend with a small Python FastAPI backend (server/ai_server.py).

- Key runtime shape:
  - Frontend dev server: `npm run dev` (Vite default, serves on :5173)
  - Backend dev server (FastAPI): `cd server && python3 -m uvicorn ai_server:app --reload` (default host `0.0.0.0`, port `4000`)
  - Start script: `./start.sh` runs both parts for convenience

- Important environment variables (check `.env` / `.env.example`):
  - `VITE_API_BASE` — base URL used by the frontend (e.g. `http://localhost:4000`)
  - `VITE_API_BASE_ORIGIN` — CORS origin value used by the Python server middleware
  - `PORT` — backend port override (default 4000)
  - `SMTP_USER` / `SMTP_PASSWORD` — used by `server/email_service.py` for notifications

- Common developer workflows (explicit commands):
  - Install deps:
    - `npm install`
    - `python3 -m pip install -r server/requirements.txt`
  - Run backend (FastAPI):
    - `cd server`
    - `python3 -m uvicorn ai_server:app --reload`
  - Run frontend:
    - `npm run dev` (open http://localhost:5173)
  - Full quick start (from repo root):
    - `chmod +x start.sh && ./start.sh`

- Troubleshooting tips (targeted to errors seen in this repo):
  - net::ERR_CONNECTION_REFUSED on `:4000/api/...` → backend not running or port mismatch. Verify backend process, `uvicorn` output, and `VITE_API_BASE` in `.env`.
  - If `Failed to fetch` is logged in the client, check browser console and then run: `cd server && python3 -m uvicorn ai_server:app --reload`.
  - 500 errors often include helpful details from the server; check the server terminal logs.

- Editing guidance for AI agent:
  - Keep changes minimal and focused: if you change an API path, update both the backend route and all frontend fetches and `QUICK_START.md`.
  - When adding new env vars, update `.env.example`, `QUICK_START.md`, and mention them in this file.
  - Tests / runtime validation: after edits, run backend with `uvicorn` and confirm it starts, then run `npm run dev` and manually exercise pages.

- Key files to inspect for general app work:
  - `server/ai_server.py` — backend (now minimal; may contain placeholders)
  - `server/email_service.py` — email integration used by feedback/contact
  - `src/pages/Landing.tsx` — landing + feature cards
  - `src/pages/Login.tsx` — login/register UI and flow

If anything in these instructions is unclear or missing (for example, a different deployment setup or a CI step), tell me which area to expand and I will update this file accordingly.
