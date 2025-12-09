# Be-Strong - Sports Supplements E‑commerce

> A full‑stack e‑commerce platform for sports nutrition products and supplements — built with React (frontend), Node.js (backend) and PostgreSQL (database). Features include user authentication (JWT + bcrypt), product management (CRUD) for admins, shopping cart, responsive UI with hamburger menu and promotion carousel.

---

**Demo:** [https://frontend-fp1s.onrender.com](https://frontend-fp1s.onrender.com)

**Frontend repository:** [https://github.com/josueeliezer01/frontend](https://github.com/josueeliezer01/frontend)

**Backend repository:** [https://github.com/josueeliezer01/backend](https://github.com/josueeliezer01/backend)

---

## Project Overview

This project is an online store specialized in sports supplements and nutrition products. It implements a modern, responsive frontend with React and React Router, backed by a Node.js API and a PostgreSQL database. Users can create accounts, log in, browse and search products and add items to a cart. Administrators have a protected dashboard for managing the product catalog (create, update, delete products including images, stock, price, and descriptions).

## Features

* Responsive single-page frontend (React) with React Router navigation.
* User registration and login using email/password.
* Password hashing with **bcrypt** and authentication via **JWT**.
* Shopping cart: add/remove items, change quantities, persist cart between sessions.
* Product search bar.
* Admin product management (create, read, update, delete) with fields: image, name, price, stock, description.
* Promotion carousel on the homepage and a hamburger menu for mobile devices.
* PostgreSQL database to store users, products, and orders.
* API-level role checks: standard user vs. admin.

## Tech Stack & Architecture

* Frontend

  * React (functional components + hooks)
  * React Router for route management
  * State management: React Context
  * HTTP client: fetch
  * Responsive layout

* Backend

  * Node.js with Express
  * Authentication: JWT (jsonwebtoken) and bcrypt for password hashing
  * Database: PostgreSQL via node-postgres `pg`
  * Image uploads


## Getting Started

### Prerequisites

* Node.js
* npm
* PostgreSQL database (local or managed)

### Clone the repositories

```bash
# Frontend
git clone https://github.com/josueeliezer01/frontend.git

# Backend
git clone https://github.com/josueeliezer01/backend.git
```

### Environment variables

Create a `.env` file in each repo with the required values.

**Backend `.env.example`**

```
PORT=4000
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_super_secret_key_here

**Frontend `.env.example`**

```
REACT_APP_API_URL=http://localhost:4000/

### Database setup

1. Create the PostgreSQL database: `createdb sports_store_db`.
2. Run the SQL schema / migrations.

```bash
# inside backend repo
npm install
npm run migrate
npm run seed
```

### Run the backend

```bash
cd backend
npm install
# set .env as described
node scr/server.js

```

### Run the frontend

```bash
cd frontend
npm install
# set .env as described
npm start

```