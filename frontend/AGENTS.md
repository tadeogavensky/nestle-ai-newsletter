# Frontend AGENTS.md

## English

### Scope

These instructions apply to `frontend`, a React + Vite + MUI application for Spanish-speaking Nestle internal users.

The app should help users generate, edit, preview, review, approve, and export newsletters. The primary UI language is Spanish. Source code remains English.

### Brand and design

- Use `src/styles/nestleMuiTheme.ts` as the source of truth for MUI theme tokens.
- Reuse assets from `src/assets`; do not duplicate fonts, logos, brand shapes, or keyword graphics.
- Follow Nestle brand guidance from `/ref/WemakeNestlé_DesignGuidelines_Final (2).pdf` when designing new pages.
- Keep UI aligned to newsletter creation workflows, not generic marketing pages.
- Use responsive layouts for desktop and mobile previews.
- Avoid decorative asset use that does not support the page task.

### Frontend implementation

- Use React components with TypeScript.
- Keep component, hook, variable, and file names in English.
- Keep user-facing labels, HTML copy, validation messages, and demo content in Spanish.
- Prefer MUI components and theme tokens before custom CSS.
- Use Axios for backend calls when an HTTP client is needed.
- Read the backend base URL from environment configuration such as `VITE_API_URL`.
- Do not hardcode production secrets or backend credentials in the frontend.

### Newsletter-specific guidance

- Treat newsletter HTML/export compatibility as a product requirement.
- Keep future MJML/export constraints in mind when creating editor or preview structures.
- Preserve clear separation between authoring UI, preview UI, and exported newsletter markup.
- Prioritize Edge compatibility for corporate browser usage.

### Commands

Run from `frontend`:

- Install dependencies: `pnpm install`
- Development server: `pnpm run dev`
- Lint: `pnpm run lint`
- Build: `pnpm run build`
- Preview production build: `pnpm run preview`

Before finishing frontend code changes, run `pnpm run lint` and `pnpm run build`.

## Español

### Alcance

Estas instrucciones aplican a `frontend`, una aplicación React + Vite + MUI para usuarios internos de Nestle que hablan español.

La app debe ayudar a generar, editar, previsualizar, revisar, aprobar y exportar newsletters. El idioma principal de la UI es español. El código fuente se mantiene en inglés.

### Marca y diseño

- Usar `src/styles/nestleMuiTheme.ts` como fuente de verdad para tokens del theme MUI.
- Reutilizar assets desde `src/assets`; no duplicar fuentes, logos, brand shapes o gráficos de keywords.
- Seguir los guidelines de marca Nestle de `/ref/WemakeNestlé_DesignGuidelines_Final (2).pdf` al diseñar nuevas páginas.
- Mantener la UI enfocada en workflows de creación de newsletters, no en páginas genéricas de marketing.
- Usar layouts responsive para previews desktop y mobile.
- Evitar uso decorativo de assets que no ayude a la tarea de la página.

### Implementación frontend

- Usar componentes React con TypeScript.
- Mantener nombres de componentes, hooks, variables y archivos en inglés.
- Mantener labels, copy HTML, mensajes de validación y contenido demo visibles al usuario en español.
- Preferir componentes MUI y tokens del theme antes que CSS custom.
- Usar Axios para llamadas al backend cuando haga falta un cliente HTTP.
- Leer la URL base del backend desde configuración de entorno como `VITE_API_URL`.
- No hardcodear secretos de producción ni credenciales backend en frontend.

### Guía específica de newsletters

- Tratar la compatibilidad HTML/export de newsletters como requerimiento de producto.
- Tener en cuenta futuras restricciones de MJML/export al crear estructuras de editor o preview.
- Mantener separación clara entre UI de edición, UI de preview y markup exportado del newsletter.
- Priorizar compatibilidad con Edge por uso de navegador corporativo.

### Comandos

Correr desde `frontend`:

- Instalar dependencias: `pnpm install`
- Servidor de desarrollo: `pnpm run dev`
- Lint: `pnpm run lint`
- Build: `pnpm run build`
- Preview del build de producción: `pnpm run preview`

Antes de terminar cambios frontend, correr `pnpm run lint` y `pnpm run build`.
