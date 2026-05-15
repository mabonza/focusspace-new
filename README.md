# Focus Space Platform

Academic conference management platform built with React + Vite + TypeScript (frontend) and Strapi (backend).

## Project Structure

```
focus-space-platform/
  frontend/       React + Vite + TypeScript + Tailwind + Framer Motion
  backend/        Strapi CMS (initialise separately)
```

---

## Getting Started

### Option A — Docker (recommended)

**Requirements:** Docker Desktop ≥ 4.x

```bash
cd focus-space-platform
docker compose up --build
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000        |
| Strapi   | http://localhost:1337        |
| Admin    | http://localhost:1337/admin  |

> **First run:** Strapi builds its admin panel on startup — allow 2–3 minutes.
> SQLite data persists in a Docker named volume (`strapi-db`).

Stop everything:
```bash
docker compose down
```

Stop and wipe volumes (reset database):
```bash
docker compose down -v
```

---

### Option B — Run locally (no Docker)

**Frontend:**

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Opens at: http://localhost:3000 — works with dummy data even without Strapi.

**Backend (Strapi):**

```bash
cd backend
cp .env.example .env
npm install
npm run develop
```

Strapi admin: http://localhost:1337/admin

See `backend/STRAPI_SETUP.md` for collection type schemas.

---

### Production (Docker + PostgreSQL)

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Set these env vars before running (or in a root `.env`):

```
DATABASE_NAME=focusspace
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=changeme
VITE_STRAPI_URL=https://api.yourdomain.com
```

---

## Frontend Pages

| Route                  | Page                |
|------------------------|---------------------|
| `/`                    | Home                |
| `/conferences`         | All Conferences     |
| `/conferences/:slug`   | Conference Detail   |
| `/past-events`         | Past Events         |
| `/speakers`            | Speakers            |
| `/programme`           | Programme Schedule  |
| `/sponsors`            | Sponsors            |
| `/publications`        | Publications        |
| `/contact`             | Contact             |
| `/login`               | Login (placeholder) |
| `/dashboard`           | Dashboard (placeholder) |

---

## Tech Stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Frontend  | React 18, Vite, TypeScript           |
| Styling   | Tailwind CSS                         |
| Animation | Framer Motion                        |
| Routing   | React Router v6                      |
| Icons     | Lucide React                         |
| Dates     | date-fns                             |
| Backend   | Strapi 5                             |
| Database  | SQLite (dev) / PostgreSQL (prod)     |

---

## Design System

- **Primary colour**: `#7B1C2E` (burgundy/maroon)
- **Accent colour**: `#C9A84C` (gold)
- **Text**: `#1A1A2E` (dark charcoal)
- **Font (headings)**: Georgia serif
- **Font (body)**: Inter sans-serif

---

## Phase 2 Modules (Planned)

- User authentication (JWT)
- Conference registration + payment gateway
- Abstract submission portal
- Peer review dashboard
- Invoice & certificate generation
- QR code check-in
- AI-assisted abstract scoring
- Mobile application (React Native)
- Push notifications

---

## Environment Variables

### frontend/.env

```
VITE_STRAPI_URL=http://localhost:1337
```

### backend/.env

```
HOST=0.0.0.0
PORT=1337
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```
