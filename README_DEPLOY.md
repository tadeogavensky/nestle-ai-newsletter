# Docker Deployment

## Overview

This deployment setup uses:

- `docker-compose.deploy.yml`
- published Docker Hub images
- `postgres:16` for the database
- nginx inside the frontend container to proxy `/api` to `backend:3000`

The backend is not exposed publicly by default. The browser talks to the frontend, and the frontend container forwards API traffic internally.

## Files For The Client

- `docker-compose.deploy.yml`
- `.env.deploy.example`
- `database/init.sql`
- `database/seed.sql`
- `README_DEPLOY.md`

## Prepare Environment

Copy the deployment environment file:

```bash
cp .env.deploy.example .env
```

Complete these values in `.env`:

- `POSTGRES_PASSWORD`
- `CLIENT_ID`
- `CLIENT_SECRET`
- `DOCKERHUB_USERNAME`
- `APP_VERSION`

`APP_VERSION` can be:

- `latest`
- a commit SHA
- a version tag such as `v1.0.0`

If the images are private:

```bash
docker login
```

## Start The Stack

```bash
docker compose -f docker-compose.deploy.yml --env-file .env pull
docker compose -f docker-compose.deploy.yml --env-file .env up -d
```

Check status:

```bash
docker compose -f docker-compose.deploy.yml --env-file .env ps
```

View backend logs:

```bash
docker compose -f docker-compose.deploy.yml --env-file .env logs backend
```

## Initialize The Database

Run these commands only the first time, when PostgreSQL is empty:

```bash
docker compose -f docker-compose.deploy.yml --env-file .env exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < database/init.sql
docker compose -f docker-compose.deploy.yml --env-file .env exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < database/seed.sql
```

## Validate Access

Open:

- `http://localhost:${FRONTEND_PORT}`
- or `http://SERVER:${FRONTEND_PORT}`

The frontend serves the SPA and proxies:

- browser request `/api/health`
- internal upstream `http://backend:3000/health`

## Notes

- `docker-compose.deploy.yml` uses `image:`, not local `build:`.
- `docker-compose.yaml` remains the local development compose.
- MinIO is intentionally not included yet.
