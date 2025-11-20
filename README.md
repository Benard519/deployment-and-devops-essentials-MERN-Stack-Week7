# Socket.io Chat – Deployment Ready MERN Application

Fully featured real-time chat platform built with the MERN stack and Socket.io. It now includes production-grade DevOps tooling, deployment manifests, CI/CD pipelines, and monitoring playbooks so you can launch (and maintain) the experience with confidence.

---

## Live Links

- **Frontend:** https://socketio-chats.netlify.app/
- **Backend/API:** https://deployment-and-devops-essentials-mern.onrender.com
---

## Tech Stack

- **Server:** Node.js 18, Express, Socket.io, MongoDB/Mongoose, JWT, Helmet, Morgan, Compression
- **Client:** React (Vite), Context API, socket.io-client, React Router, React Hot Toast
- **Tooling:** Netlify (frontend), Render (backend), GitHub Actions (CI/CD), UptimeRobot + Sentry (monitoring)

### Repository Layout

```
socketio-chat/
├── client/                     # Vite + React SPA
├── server/                     # Express + Socket.io API
├── deployment/                 # Render + Netlify manifests
│   ├── backend/
│   │   └── render.yaml
│   └── frontend/
│       ├── netlify.toml
│       └── vercel.json
├── monitoring/                 # Health check & observability guides
├── .github/workflows/          # CI/CD pipelines
└── .env.example                # Shared environment contract
```

---

## Features Recap

### Core
- Username-based authentication with JWT session storage.
- Global lobby room plus arbitrary room creation/join.
- MongoDB message storage (`from`, `fromName`, `roomId`, `toUserId`, `text`, `ts`, `readBy`).
- Presence broadcasts, typing indicators, and guaranteed message acknowledgements.

### Advanced
- Private 1:1 channels, read receipts, notification bell, desktop notifications, pagination, and retry queue.
- Resilient reconnection logic that re-joins rooms and restores presence.
- Production hardening: secure headers, structured logging, error middleware, `/health` endpoint.

---

## Environment Variables

A repo-level `.env.example` documents every required variable:

```
# Backend
MONGO_URI=mongodb://127.0.0.1:27017/socketio-chat
JWT_SECRET=supersecret
PORT=5000
FRONTEND_URL=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:5000
```

Duplicate it as `.env` (per service or at the repo root) and fill in real secrets before running or deploying.

---

## Running Locally

### Backend
```bash
cd server
npm install
npm run dev   # nodemon server.js on http://localhost:5000
```
Requirements:
- MongoDB running locally or a cloud URI defined in `MONGO_URI`.
- `FRONTEND_URL` should include the local Vite origin for CORS (default already covers it).

### Frontend
```bash
cd client
npm install
npm run dev   # Vite served at http://localhost:5173
```
The SPA reads `VITE_API_URL` to target the API. Update it when pointing to staging/production.

### Production Builds
```bash
# API (no bundle step)
cd server && npm start

# Frontend
cd client && npm run build && npm run preview
```

---

## Deployment Playbooks

### Backend → Render

1. Create a Render Web Service and point it to this repo.
2. Use the settings in `deployment/backend/render.yaml`:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Env Vars:** `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, `PORT` (Render auto-injects `PORT`, but the manifest defaults to `10000`).
3. Enable automatic deploys from `main` if desired.
4. Add a custom domain and enforce HTTPS once verified.

### Frontend → Netlify

1. Import the repo into Netlify and connect your GitHub repository.
2. Configure build settings (or use `deployment/frontend/netlify.toml`):
   - **Base directory:** `client`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `client/dist`
3. Add environment variable `VITE_API_URL=https://<render-api-url>` in Netlify dashboard.
4. Deploy. The SPA will automatically talk to the Render API via the configured URL.

---

## CI/CD Pipelines

Workflows inside `.github/workflows/`:

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `frontend-ci.yml` | Pull requests touching `client/**` | Installs deps, runs ESLint, Vitest, and `vite build`. |
| `backend-ci.yml` | Pull requests touching `server/**` | Installs deps, ESLint, Node test runner, quick `npm start --help`. |
| `frontend-cd.yml` | Push to `main` (client/deployment files) | Builds + deploys via Netlify CLI using `NETLIFY_*` secrets. |
| `backend-cd.yml` | Push to `main` (server/deployment files) | Triggers Render deploy via API using `RENDER_*` secrets. |

> Configure `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, `VITE_API_URL`, `RENDER_API_KEY`, and `RENDER_SERVICE_ID` in GitHub repo secrets.

---

## Monitoring & Maintenance

- `/health` endpoint: JSON payload with status, uptime, timestamp.
- Documentation under `monitoring/`:
  - `health-check.md` explains backend and frontend probes.
  - `monitoring-setup.md` covers Sentry, UptimeRobot, PM2, and frontend performance ideas.
- Logging via Morgan (combined in production) + Helmet for secure headers + Compression for response size.

---

## Manual QA Checklist

1. **Login Flow:** two browsers, different usernames.
2. **Global Room:** confirm real-time messaging in default lobby.
3. **Room Management:** create/join rooms, use pagination button.
4. **Private Messaging:** DM, check read receipts.
5. **Typing & Presence:** indicator + online chips update live.
6. **Notifications:** change rooms, send messages, confirm bell count/toast/sound/desktop notification.
7. **Reconnection:** disable network or restart API; client should auto-rejoin rooms and restore presence.

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| `MongoNetworkError` on boot | Verify Mongo service + credentials, allow IP in Atlas. |
| White screen locally | Check browser console, ensure `VITE_API_URL` points to reachable API. |
| CORS blocked | Confirm `FRONTEND_URL` includes deployed SPA domain (comma-separated list allowed). |
| Desktop notifications missing | Allow notifications in the browser and send one message post-login. |
| Render deploy fails | Tail logs in Render dashboard, ensure `MONGO_URI`/`JWT_SECRET` env vars exist. |

---

## Deployment Scripts Folder

- `deployment/backend/render.yaml` – infrastructure-as-code manifest for Render.
- `deployment/frontend/netlify.toml` – Netlify configuration for the Vite SPA.

Update these when environments change (custom domains, scaling plan, env vars, etc.).

---

## Monitoring Folder

- `monitoring/health-check.md` – backend/frontend probes and combined smoke tests.
- `monitoring/monitoring-setup.md` – Sentry snippet, UptimeRobot, PM2, frontend performance monitoring ideas.

---

Happy chatting & shipping! 🚀




