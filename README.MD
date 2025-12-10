# Be-Strong - Sports Supplements E‑commerce

> Full‑stack e‑commerce platform for sports supplements and nutrition — Frontend in React, Backend in Node.js/Express and PostgreSQL. Authentication with JWT + bcrypt, admin dashboard (product CRUD), persistent cart, responsive UI with hamburger menu and promotion carousel.

---

**Demo:** [https://frontend-fp1s.onrender.com](https://frontend-fp1s.onrender.com)

**Frontend repository:** [https://github.com/josueeliezer01/frontend](https://github.com/josueeliezer01/frontend)

**Backend repository:** [https://github.com/josueeliezer01/backend](https://github.com/josueeliezer01/backend)

**Container image (optional quick test):** `ghcr.io/josueeliezer01/app-image:latest`

---

## Overview

Online store specialized in sports supplements. Users can create an account, authenticate, search products and use a cart. Administrators have a protected area to manage the catalog (image, name, price, stock and description).

## Key features

* Responsive SPA frontend (React + React Router)
* Authentication (bcrypt + JWT)
* Persistent cart (add/edit/remove items)
* Product search
* Admin dashboard with permissions for product CRUD
* Homepage promotions and hamburger menu for mobile
* Backend in Node.js/Express with PostgreSQL (`pg`)

---

## Architecture and stack

* **Frontend:** React (hooks), React Router, Context API, fetch
* **Backend:** Node.js, Express, JWT, bcrypt, node-postgres (`pg`)
* **DB:** PostgreSQL
* **Containers:** Docker + Docker Compose (setup included)

---

## Requirements

* Node.js (recommended v16+)
* npm or yarn
* Docker and Docker Compose (if you want to use containers)
* PostgreSQL (if running locally)

---

## Environment configuration (.env)

### `.env.example` (for Docker / Docker Compose)

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@db:5432/be_strong
PG_HOST=db
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DATABASE=be_strong
JWT_SECRET=your_super_secret_key_here
```

### `.env.example.local` (for local run without Docker)

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/be_strong
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DATABASE=be_strong
JWT_SECRET=your_super_secret_key_here
```

---

## Running with Docker (recommended)

Docker Compose makes it easy to reproduce the full environment (DB + backend + frontend). The `db-init/` folder contains `be_strong.dump` and `restore.sh` — when Postgres initializes for the first time, files placed in `/docker-entrypoint-initdb.d` will be executed automatically to populate the database.

---

## Using the GitHub Container Registry image (optional quick test)

A prebuilt container image is available at `ghcr.io/josueeliezer01/app-image:latest`. This image includes and runs the full stack (frontend, backend and the database) already configured — you only need to run the image.

Example (basic):

```bash
# pull and run the container (adjust ports as needed)
docker run --rm -p 80:80 ghcr.io/josueeliezer01/app-image:latest
```

---

## Running without Docker (local)

If you prefer to run everything locally (Postgres installed locally):

1. Create the local database:

```bash
createdb be_strong
```

2. Restore the dump

```bash
pg_restore -Fc -d be_strong db-init/be_strong.dump
```

If the dump is a plain SQL file:

```bash
psql be_strong < db-init/be_strong.dump
```

3. Adjust the `.env` to point to `localhost` (see `.env.example.local`) and run the backend:

```bash
cd backend
npm install
# optional: run migrations if you prefer not to use the dump
npx node-pg-migrate up -m ./migrations
node src/server.js
```

---

## Running migrations and seeds

The project uses `node-pg-migrate` for migrations. Examples:

```bash
# apply migrations
npx node-pg-migrate up -m ./migrations

# seeds
node scripts/seed.js
```

---
