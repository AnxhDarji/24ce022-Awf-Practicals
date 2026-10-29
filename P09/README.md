# Practical 09 - In-Memory Caching and Query Optimization

This practical reuses the P07 Task Management API and caches `GET /tasks` responses with `node-cache`. The single shared cache entry expires after 60 seconds. The current P07 API returns the same task list to every authenticated user, so it uses the `all_tasks` key. A successful task create, update, or delete clears that entry so the next list request reads fresh data from MongoDB.

## Setup

1. Ensure MongoDB is running locally or provide a MongoDB connection string.
2. In `backend`, copy `.env.example` to `.env` and set `MONGO_URI` and a private `JWT_SECRET`.
3. Install dependencies and start the API:

```bash
cd backend
npm install
npm start
```

The API listens on `http://localhost:8000` by default.

## Postman testing

1. Register with `POST http://localhost:8000/auth/register`, using JSON such as `{"email":"student@example.com","password":"secret123"}`.
2. Log in at `POST http://localhost:8000/auth/login` with the same credentials and copy the returned `token`.
3. In Postman, set the request authorization type to token-based and paste the token from the login response.
4. Send `GET http://localhost:8000/tasks`. The backend logs `Task list cache MISS` on the first request; send it again before 60 seconds to see `Task list cache HIT`.
5. Create a task with `POST /tasks` and JSON such as `{"title":"Caching practical"}`. Repeat GET `/tasks`; it should log a MISS and include the new task.
6. Repeat the check after a successful `PUT /tasks/:id` or `DELETE /tasks/:id`. The list should be refreshed after each write.

To compare response times fairly, use the same token, data, endpoint, and environment. Measure three uncached requests before enabling caching and three cached HIT requests after warming the cache, then record the readings in [performance-comparison.md](./performance-comparison.md).
