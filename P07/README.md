# Practical 7 - Authentication and Middleware Pipeline

React frontend + Express/Mongoose task manager with JWT authentication.

## Setup

1. Ensure MongoDB is running locally, or use a MongoDB Atlas connection string.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` and a private `JWT_SECRET`.
3. In two terminals, install and start both projects:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Open the frontend at `http://localhost:5174`. The Express API runs at `http://localhost:8000`.

## API

- `POST /auth/register` — register with `{ "email": "...", "password": "..." }`
- `POST /auth/login` — login with the same fields; returns a JWT
- `GET /me` — return the authenticated user's ID and email
- `GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id` — require an `Authorization` header with `Bearer your-JWT-here`

Registration and login require a valid email and a password of at least 6 characters. New tasks require a non-empty title.

## Postman test

1. Send `POST http://localhost:8000/auth/register` with a JSON email and password.
2. Send `POST http://localhost:8000/auth/login` with those credentials and copy `token` from the response.
3. Send a task request such as `GET http://localhost:8000/tasks` with header `Authorization: Bearer your-copied-JWT`.
4. For `POST /tasks`, include JSON such as `{ "title": "Read chapter 7", "description": "Optional" }`.
5. Try the task routes without the header, with a bad token, and with an empty title to verify the error responses.
