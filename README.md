# Nestle AI Newsletter

Application for creating and managing internal newsletters with a React frontend, a NestJS backend, Prisma 7, and a local PostgreSQL database for development.

## English

### Project Structure

```txt
.
|-- backend/                 # NestJS API
|   |-- prisma/              # Prisma schema and config
|   |-- src/
|   |   |-- prisma/          # PrismaModule and PrismaService
|   |   `-- ...
|   |-- Dockerfile
|   |-- package.json
|   `-- pnpm-lock.yaml
|-- frontend/                # React + Vite + MUI app
|   |-- src/
|   |-- Dockerfile
|   |-- package.json
|   `-- pnpm-lock.yaml
|-- database/
|   |-- init.sql             # Executable local schema
|   `-- seed.sql             # Minimal local seed data
|-- .github/workflows/
|-- docker-compose.yaml
`-- README.md
```

### Local Development Stack

- PostgreSQL 16 in Docker Compose
- NestJS backend run locally with `pnpm`
- React + Vite frontend run locally with `pnpm`
- Prisma 7 with PostgreSQL

The project no longer uses Supabase as the cloud database target for local development. For daily development, only PostgreSQL should run in Docker. Backend and frontend should run directly on the host with `pnpm`.

### Docker Compose

`docker-compose.yaml` is validated for local development with:

- `postgres` service present
- `postgres:16`
- `POSTGRES_USER=nestle`
- `POSTGRES_PASSWORD=nestle`
- `POSTGRES_DB=nestle_newsletter`
- host/container port mapping `5433:5432`
- persistent volume `postgres_data:/var/lib/postgresql/data`

If you run the backend container, its internal database settings are:

```env
DATABASE_URL=postgresql://nestle:nestle@postgres:5432/nestle_newsletter
DIRECT_URL=postgresql://nestle:nestle@postgres:5432/nestle_newsletter
```

### Environment Variables

Create `backend/.env` locally from [backend/.env.example](/C:/Users/Tadeo/Desktop/ORT/4to/PF/Nestle/nestle-ai-newsletter/backend/.env.example). Do not commit `backend/.env`.

Required local database values:

```env
DATABASE_URL="postgresql://nestle:nestle@localhost:5433/nestle_newsletter"
DIRECT_URL="postgresql://nestle:nestle@localhost:5433/nestle_newsletter"
```

Notes:

- `DATABASE_URL` is the default runtime connection.
- `DIRECT_URL` is used for direct Prisma tasks and is also accepted by `PrismaService`.
- `backend/.env` is ignored by Git through the root `.gitignore`.
- `backend/.env.example` must contain placeholders only, never real secrets.

### Daily Development

For normal development:

```bash
docker compose up -d postgres
pnpm --dir backend dev
pnpm --dir frontend dev
```

Development URLs:

- PostgreSQL from the host: `localhost:5433`
- PostgreSQL from Docker services: `postgres:5432`
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

Notes:

- You do not need to run backend or frontend in Docker during daily development.
- PostgreSQL runs in Docker.
- Backend and frontend run locally with `pnpm`.

If your backend package does not expose `dev`, use:

```bash
pnpm --dir backend run start:dev
```

### Local Database Validation From Scratch

1. Start PostgreSQL:

```bash
docker compose up -d postgres
```

2. Wait until PostgreSQL is ready:

```bash
docker compose logs postgres
```

3. Load the schema:

```bash
docker compose exec -T postgres psql -U nestle -d nestle_newsletter < database/init.sql
```

4. Load the seed:

```bash
docker compose exec -T postgres psql -U nestle -d nestle_newsletter < database/seed.sql
```

5. Validate tables:

```bash
docker compose exec postgres psql -U nestle -d nestle_newsletter
\dt
```

6. Validate local users:

```sql
SELECT email, role, state
FROM public.users
ORDER BY role;
```

Expected users:

- `admin@local.test` with role `ADMIN`
- `functional@local.test` with role `FUNCTIONAL`
- `user@local.test` with role `USER`

7. Validate permissions per role:

```sql
SELECT role, COUNT(*) AS permissions_count
FROM public.role_permissions
GROUP BY role
ORDER BY role;
```

Expected result:

```txt
ADMIN      16
FUNCTIONAL 10
USER       5
```

8. Validate Prisma:

```bash
pnpm --dir backend prisma validate
pnpm --dir backend prisma generate
```

If your local `pnpm` installation does not resolve the Prisma binary with that form, use:

```bash
pnpm --dir backend exec prisma validate
pnpm --dir backend exec prisma generate
```

9. Optional introspection check:

```bash
pnpm --dir backend prisma db pull
git diff backend/prisma/schema.prisma
```

If your local `pnpm` installation needs explicit binary execution, use:

```bash
pnpm --dir backend exec prisma db pull
git diff backend/prisma/schema.prisma
```

The expected diff should be empty or cosmetic only. Large structural changes usually mean `database/init.sql` is not aligned with `backend/prisma/schema.prisma`.

### PowerShell Alternative

If the `<` operator fails in Windows PowerShell, use:

```powershell
Get-Content .\database\init.sql -Raw | docker compose exec -T postgres psql -U nestle -d nestle_newsletter
Get-Content .\database\seed.sql -Raw | docker compose exec -T postgres psql -U nestle -d nestle_newsletter
```

### Prisma Notes

`backend/prisma/schema.prisma` is aligned with PostgreSQL and uses enums, not old catalog tables, for:

- `area_name`
- `asset_type`
- `block_content_type`
- `newsletter_format`
- `newsletter_language`
- `newsletter_state`
- `user_role`
- `user_state`

The schema should not reintroduce old catalog models such as:

- `user_roles`
- `user_states`
- `asset_types`
- `block_content_types`
- `languages`
- `newsletter_states`
- `newsletter_formats`

`users.role` and `users.state` use enums directly. `newsletters.state`, `newsletters.language`, and `newsletters.format` also use enums directly.

Prisma 7 runtime note:

- The backend uses the Prisma PostgreSQL adapter through [prisma.service.ts](/C:/Users/Tadeo/Desktop/ORT/4to/PF/Nestle/nestle-ai-newsletter/backend/src/prisma/prisma.service.ts).
- `PrismaService` accepts `DIRECT_URL` first and falls back to `DATABASE_URL`.
- `backend/prisma.config.ts` uses the same fallback for Prisma CLI commands.

### Reset Local Database

Stop PostgreSQL without deleting data:

```bash
docker compose stop postgres
```

Stop containers without deleting data:

```bash
docker compose down
```

Delete the full local database volume:

```bash
docker compose down -v
```

After `docker compose down -v`, run:

```bash
docker compose up -d postgres
docker compose exec -T postgres psql -U nestle -d nestle_newsletter < database/init.sql
docker compose exec -T postgres psql -U nestle -d nestle_newsletter < database/seed.sql
```

### Security

Do not commit:

- `backend/.env`
- `frontend/.env`
- build output
- real credentials

If a secret is committed by accident:

1. Remove it from the branch before pushing.
2. Rotate the secret in the provider.
3. Verify `.gitignore` coverage.

## Espanol

Aplicacion para crear y gestionar newsletters internos con frontend React, backend NestJS, Prisma 7 y base PostgreSQL local para desarrollo.

### Estructura Del Proyecto

```txt
.
|-- backend/                 # API NestJS
|   |-- prisma/              # Schema y config de Prisma
|   |-- src/
|   |   |-- prisma/          # PrismaModule y PrismaService
|   |   `-- ...
|   |-- Dockerfile
|   |-- package.json
|   `-- pnpm-lock.yaml
|-- frontend/                # App React + Vite + MUI
|-- database/
|   |-- init.sql             # Schema ejecutable local
|   `-- seed.sql             # Seeds minimos locales
|-- .github/workflows/
|-- docker-compose.yaml
`-- README.md
```

### Stack De Desarrollo Local

- PostgreSQL 16 en Docker Compose
- Backend NestJS corriendo local con `pnpm`
- Frontend React + Vite corriendo local con `pnpm`
- Prisma 7 con PostgreSQL

El proyecto ya no usa Supabase como base cloud para el desarrollo local. En el dia a dia se recomienda levantar solo PostgreSQL en Docker y correr backend/frontend en el host con `pnpm`.

### Docker Compose

`docker-compose.yaml` esta validado con:

- servicio `postgres`
- imagen `postgres:16`
- `POSTGRES_USER=nestle`
- `POSTGRES_PASSWORD=nestle`
- `POSTGRES_DB=nestle_newsletter`
- mapeo `5433:5432`
- volumen persistente `postgres_data:/var/lib/postgresql/data`

Si se corre el backend dentro de Docker, usa:

```env
DATABASE_URL=postgresql://nestle:nestle@postgres:5432/nestle_newsletter
DIRECT_URL=postgresql://nestle:nestle@postgres:5432/nestle_newsletter
```

### Variables De Entorno

Crear `backend/.env` a partir de [backend/.env.example](/C:/Users/Tadeo/Desktop/ORT/4to/PF/Nestle/nestle-ai-newsletter/backend/.env.example). No commitear `backend/.env`.

Valores locales requeridos:

```env
DATABASE_URL="postgresql://nestle:nestle@localhost:5433/nestle_newsletter"
DIRECT_URL="postgresql://nestle:nestle@localhost:5433/nestle_newsletter"
```

Notas:

- `DATABASE_URL` es la conexion de runtime.
- `DIRECT_URL` sirve para tareas directas de Prisma y tambien lo acepta `PrismaService`.
- `backend/.env` esta ignorado por Git desde el `.gitignore` root.
- `backend/.env.example` debe tener placeholders, nunca secretos reales.

### Desarrollo Diario

Para desarrollar normalmente:

```bash
docker compose up -d postgres
pnpm --dir backend dev
pnpm --dir frontend dev
```

URLs:

- PostgreSQL desde el host: `localhost:5433`
- PostgreSQL desde Docker: `postgres:5432`
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

Notas:

- No hace falta correr backend/frontend en Docker durante el desarrollo diario.
- PostgreSQL corre en Docker.
- Backend y frontend corren con `pnpm`.

Si el backend no expone `dev`, usar:

```bash
pnpm --dir backend run start:dev
```

### Validacion Local Desde Cero

1. Levantar PostgreSQL:

```bash
docker compose up -d postgres
```

2. Esperar a que este listo:

```bash
docker compose logs postgres
```

3. Cargar schema:

```bash
docker compose exec -T postgres psql -U nestle -d nestle_newsletter < database/init.sql
```

4. Cargar seed:

```bash
docker compose exec -T postgres psql -U nestle -d nestle_newsletter < database/seed.sql
```

5. Validar tablas:

```bash
docker compose exec postgres psql -U nestle -d nestle_newsletter
\dt
```

6. Validar usuarios:

```sql
SELECT email, role, state
FROM public.users
ORDER BY role;
```

Usuarios esperados:

- `admin@local.test` con role `ADMIN`
- `functional@local.test` con role `FUNCTIONAL`
- `user@local.test` con role `USER`

7. Validar permisos por rol:

```sql
SELECT role, COUNT(*) AS permissions_count
FROM public.role_permissions
GROUP BY role
ORDER BY role;
```

Resultado esperado:

```txt
ADMIN      16
FUNCTIONAL 10
USER       5
```

8. Validar Prisma:

```bash
pnpm --dir backend prisma validate
pnpm --dir backend prisma generate
```

Si tu instalacion local de `pnpm` no resuelve el binario Prisma con esa forma, usar:

```bash
pnpm --dir backend exec prisma validate
pnpm --dir backend exec prisma generate
```

9. Introspection opcional:

```bash
pnpm --dir backend prisma db pull
git diff backend/prisma/schema.prisma
```

Si tu `pnpm` local necesita ejecucion explicita del binario, usar:

```bash
pnpm --dir backend exec prisma db pull
git diff backend/prisma/schema.prisma
```

El diff esperado deberia ser vacio o solo cosmetico. Si aparecen cambios estructurales grandes, `database/init.sql` no esta alineado con `backend/prisma/schema.prisma`.

### Alternativa PowerShell

Si el operador `<` falla en Windows PowerShell, usar:

```powershell
Get-Content .\database\init.sql -Raw | docker compose exec -T postgres psql -U nestle -d nestle_newsletter
Get-Content .\database\seed.sql -Raw | docker compose exec -T postgres psql -U nestle -d nestle_newsletter
```

### Notas De Prisma

`backend/prisma/schema.prisma` esta alineado con PostgreSQL y usa enums, no tablas catalogo viejas, para:

- `area_name`
- `asset_type`
- `block_content_type`
- `newsletter_format`
- `newsletter_language`
- `newsletter_state`
- `user_role`
- `user_state`

No deberian existir modelos viejos como:

- `user_roles`
- `user_states`
- `asset_types`
- `block_content_types`
- `languages`
- `newsletter_states`
- `newsletter_formats`

`users.role` y `users.state` usan enums directos. `newsletters.state`, `newsletters.language` y `newsletters.format` tambien usan enums directos.

Nota de runtime Prisma 7:

- El backend usa el adapter PostgreSQL de Prisma en [prisma.service.ts](/C:/Users/Tadeo/Desktop/ORT/4to/PF/Nestle/nestle-ai-newsletter/backend/src/prisma/prisma.service.ts).
- `PrismaService` prioriza `DIRECT_URL` y si no existe usa `DATABASE_URL`.
- `backend/prisma.config.ts` usa la misma logica para comandos CLI.

### Reset De La Base Local

Apagar PostgreSQL sin borrar datos:

```bash
docker compose stop postgres
```

Bajar contenedores sin borrar datos:

```bash
docker compose down
```

Borrar completamente la base local:

```bash
docker compose down -v
```

Despues de `docker compose down -v`, correr:

```bash
docker compose up -d postgres
docker compose exec -T postgres psql -U nestle -d nestle_newsletter < database/init.sql
docker compose exec -T postgres psql -U nestle -d nestle_newsletter < database/seed.sql
```

### Seguridad

No commitear:

- `backend/.env`
- `frontend/.env`
- builds
- credenciales reales

Si una secret se sube por error:

1. Quitarla de la rama antes de pushear.
2. Rotarla en el proveedor correspondiente.
3. Verificar que `.gitignore` la cubra.
