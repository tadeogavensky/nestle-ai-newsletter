# Backend AGENTS.md

## English

### Scope

These instructions apply to `backend`, a NestJS + TypeScript API. The backend owns business workflows, validation, authentication/authorization integration, Prisma data access, Supabase integration, newsletter export orchestration, and the Nestle GenIA proxy.

### Architecture

- Keep NestJS modules small and explicit: module, controller, service when business logic grows.
- Controllers should handle HTTP shape only. Put reusable business logic in services.
- Use `@nestjs/config` for environment access.
- Use Prisma for database access when persistence is involved.
- Keep DTOs and response shapes typed.
- Prefer simple direct HTTP calls for Nestle GenIA unless the task requires a higher-level AI orchestration layer.

### Security

- Never return raw secrets, tokens, credentials, or environment values.
- `CLIENT_ID` and `CLIENT_SECRET` may be used as outbound headers only.
- Keep CORS restricted to configured production and localhost origins.
- Validate user-controlled input before using it in persistence, exports, or AI calls.
- Avoid logging prompts or generated content if they may contain internal data.

### Commands

Run from `backend`:

- Install dependencies: `pnpm install`
- Development server: `pnpm run start:dev`
- Build: `pnpm run build`
- Targeted lint: `pnpm exec eslint src/**/*.ts`
- Existing lint script may apply fixes: `pnpm run lint`
- Tests: `pnpm test`

Before finishing backend code changes, run `pnpm run build` and the most relevant lint/test command for the touched area.

### Naming and language

- Code, files, classes, methods, variables, and comments should be in English.
- User-facing API messages that surface directly in the frontend may be Spanish.
- Prefer clear names over abbreviations.

## Español

### Alcance

Estas instrucciones aplican a `backend`, una API NestJS + TypeScript. El backend maneja workflows de negocio, validaciones, integración de autenticación/autorización, acceso a datos con Prisma, integración con Supabase, orquestación de exportación de newsletters y proxy hacia Nestle GenIA.

### Arquitectura

- Mantener módulos NestJS chicos y explícitos: module, controller, service cuando crece la lógica.
- Los controllers deben manejar solo la forma HTTP. La lógica reutilizable va en services.
- Usar `@nestjs/config` para acceder a variables de entorno.
- Usar Prisma para acceso a base de datos cuando haya persistencia.
- Mantener DTOs y formas de respuesta tipadas.
- Preferir llamadas HTTP directas simples para Nestle GenIA salvo que la tarea requiera una capa superior de orquestación IA.

### Seguridad

- Nunca devolver secretos, tokens, credenciales o valores de entorno crudos.
- `CLIENT_ID` y `CLIENT_SECRET` pueden usarse solo como headers salientes.
- Mantener CORS restringido a producción configurada y orígenes localhost.
- Validar input del usuario antes de usarlo en persistencia, exportaciones o llamadas de IA.
- Evitar loguear prompts o contenido generado si pueden contener información interna.

### Comandos

Correr desde `backend`:

- Instalar dependencias: `pnpm install`
- Servidor de desarrollo: `pnpm run start:dev`
- Build: `pnpm run build`
- Lint puntual: `pnpm exec eslint src/**/*.ts`
- El script existente de lint puede aplicar fixes: `pnpm run lint`
- Tests: `pnpm test`

Antes de terminar cambios backend, correr `pnpm run build` y el lint/test más relevante para el área tocada.

### Nombres e idioma

- Código, archivos, clases, métodos, variables y comentarios deben estar en inglés.
- Los mensajes de API visibles directamente en frontend pueden estar en español.
- Preferir nombres claros antes que abreviaturas.
