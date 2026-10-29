# Practical 10 - Asynchronous Processing with Event-Driven Architecture

This practical reuses the P09 Task Management API. After MongoDB successfully creates a task, the API invalidates the task-list cache and emits `task-created`. A separate listener schedules the notification log with `setTimeout()` so the HTTP route does not wait for the simulated two-second delay. The listener logs the task title, timestamp, and authenticated user ID. A `task-deleted` event is also emitted following a successful deletion.

The event emitter is Node.js's built-in `EventEmitter`; no event-processing package or infrastructure is added. Because `emit()` invokes listeners synchronously, the listener immediately schedules its work and returns. The listener module is loaded before MongoDB connects and before the server starts accepting requests.

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

## Postman test

1. Register using `POST http://localhost:8000/auth/register` with JSON such as `{"email":"student@example.com","password":"secret123"}`.
2. Log in using `POST http://localhost:8000/auth/login`, then copy the returned JWT.
3. In Postman, select the Authorization tab, choose the JWT authentication method, and paste the token.
4. Send `POST http://localhost:8000/tasks` with JSON such as `{"title":"Test background notification","description":"Practical 10"}`.
5. Check that the API returns `201` and the existing task JSON response. The backend logs the event emission and response time; about two seconds later, it logs notification start and finish.
6. Send an empty-title POST to confirm validation still returns `400`. Use `GET /tasks` to check that cache invalidation leaves the newly created task visible.
7. Optionally delete a task with `DELETE /tasks/:id` and look for its delayed deletion log.

Compare ISO timestamps in the server logs. The response-send log should occur before the deferred notification-start and notification-finished logs. Postman shows client response duration; the logs demonstrate the sequence and the listener's simulated delay.

## Verified run

With MongoDB running locally, authenticated task creation returned HTTP 201 in **2.31 ms** on the final local test run. The logs showed:

```text
[2026-10-24T14:04:19.547Z] Emitted task-created for "P10 final event timing check".
[2026-10-24T14:04:19.547Z] Sending task creation response.
[2026-10-24T14:04:21.548Z] Notification started: task "P10 final event timing check" ...
[2026-10-24T14:04:21.548Z] Notification finished for task "P10 final event timing check".
```

The test also checked authentication, empty-title validation, cache refresh after creation, the delayed deletion log, and listener error handling in a separate simulated-error check. Temporary test records were removed.
