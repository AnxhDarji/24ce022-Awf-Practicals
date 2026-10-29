# Practical 11 - Docker Containerization

## Objective

Containerize the P10 task manager as a full-stack application while preserving its React UI, Express API, JWT authentication, task routes, MongoDB models, cache, and event-driven notifications.

## Services and networking

- **frontend** builds the Vite React application and serves its production files with Nginx on host port `8080`. Nginx forwards `/api/` requests to the backend.
- **backend** runs the Express API on port `8000` and connects to MongoDB using the Compose hostname `mongodb`.
- **mongodb** stores application data and requires the configured root credentials.
- All services join the user-defined bridge network `app-network`. The named volume `mongodb-data` persists database files across container removal and restart.

The MongoDB port is not published to the host; the API and browser reach it through the Compose network.

## Prerequisites

- Docker Desktop (or Docker Engine) with Docker Compose v2
- Ports `8080` and `8000` available on the host

## Configure and start

Run these commands from the `P11` directory:

```bash
cp .env.example .env
```

Edit `.env` before starting. Replace both placeholder values with private values. Use a long, random alphanumeric value for `MONGO_ROOT_PASSWORD` (the value is embedded in a MongoDB URI and must be URI-safe); use a separate long, random value for `JWT_SECRET`. Do not commit or share `.env`.

For example, generate a JWT secret locally with:

```bash
openssl rand -hex 32
```

Build the images and start the services:

```bash
docker compose up --build -d
```

Check service and health status:

```bash
docker compose ps
```

Open the application at **http://localhost:8080**. The frontend uses the same-origin API proxy at **http://localhost:8080/api**; for direct API clients such as Postman, use **http://localhost:8000**.

To inspect logs:

```bash
docker compose logs -f
```

## Stop and clean up

Stop and remove containers and the Compose network while preserving database data:

```bash
docker compose down
```

To intentionally delete the database and all stored users/tasks as well:

```bash
docker compose down --volumes
```

## Troubleshooting

- **Compose reports a missing environment variable:** confirm `.env` exists in `P11` and contains all three entries shown in `.env.example`.
- **A port is already in use:** stop the conflicting process or change the host-side port in `docker-compose.yml`; keep the container-side ports unchanged.
- **Backend is unhealthy or cannot connect:** inspect `docker compose logs backend mongodb`, verify that the MongoDB credentials in `.env` are valid, and check that MongoDB reports healthy with `docker compose ps`.
- **Frontend cannot reach the API:** confirm that backend is healthy and review `docker compose logs frontend backend`. Browser calls should use `/api`; `mongodb` is a container-network hostname and is not a browser URL.
- **Need a completely fresh database:** `docker compose down --volumes` permanently deletes the named database volume. Do not use it when preserving data matters.
