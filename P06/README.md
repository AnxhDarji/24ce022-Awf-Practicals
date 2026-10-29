# Practical 6 - Full Stack Task Manager

React frontend + Express/Mongoose backend for creating, viewing, editing, and deleting MongoDB tasks.

## Setup

1. Ensure MongoDB is running locally, or use a MongoDB Atlas connection string.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` if needed.
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

- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`
