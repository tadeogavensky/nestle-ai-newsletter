# AGENTS.md

## English

### Project context

This repository is `nestle-ai-newsletter`, a platform for generating internal Nestle newsletters with AI assistance, predefined brand-aligned templates, review/approval workflows, and export support.

Use `/ref` as project reference material. The development plan PDF describes the intended product scope, actors, requirements, and architecture. The Nestle brand guideline PDF describes visual identity constraints. Treat these files as context, not as automatic implementation requests.

The expected product language is Spanish for user-facing pages, HTML copy, labels, validation messages, and demo content. Code, file names, identifiers, comments, commit messages, PR descriptions, and technical documentation should be written in English unless the task explicitly asks otherwise.

### Product scope

- Build for internal communications teams creating newsletters without technical support.
- Support structured newsletter creation from predefined templates.
- Support AI-assisted generation for subject, preheader, headlines, body, CTA, and closing copy.
- Support review and approval states: draft, in review, changes requested, approved, archived.
- Preserve traceability for versions, comments, approvals, and exports.
- Export targets include HTML/MJML, PDF, and internal web preview.
- Do not implement email sending automation unless explicitly requested.

### Engineering rules

- Use `pnpm`; do not introduce `npm` or `yarn` lockfiles.
- Keep changes scoped to the user request.
- Do not edit or commit `.env` values, credentials, API keys, or secrets.
- Do not expose `CLIENT_ID`, `CLIENT_SECRET`, Supabase keys, or AI credentials in logs or HTTP responses.
- Do not revert existing user changes unless the user explicitly asks.
- Prefer existing project patterns over new abstractions.
- Add dependencies only when they are clearly necessary.
- Run the most relevant validation commands before finishing.

### AI integration guidance

The current practical integration path is the Nestle GenIA/Cloudhub endpoint using `CLIENT_ID` and `CLIENT_SECRET`. Do not add LangChain just because the planning document mentions it. Add LangChain only when a task explicitly needs chains, tools, agents, memory, RAG, or provider abstraction.

### Git and reviews

- Keep PRs small and reviewable.
- Summaries should mention files changed and validation commands run.
- Prioritize bug risk, missing tests, security, and product behavior in code reviews.

## Español

### Contexto del proyecto

Este repositorio es `nestle-ai-newsletter`, una plataforma para generar newsletters internos de Nestle con asistencia de IA, templates predefinidos alineados a marca, flujo de revisión/aprobación y soporte de exportación.

Usar `/ref` como material de referencia del proyecto. El PDF del plan de desarrollo describe alcance, actores, requerimientos y arquitectura esperada. El PDF de guidelines de Nestle describe restricciones visuales de marca. Estos archivos son contexto, no pedidos automáticos de implementación.

El idioma esperado del producto es español para páginas visibles al usuario, copy HTML, labels, mensajes de validación y contenido demo. El código, nombres de archivos, identificadores, comentarios, commits, PRs y documentación técnica deben escribirse en inglés salvo que la tarea pida otra cosa.

### Alcance del producto

- Construir para equipos de comunicaciones internas que generan newsletters sin soporte técnico.
- Soportar creación estructurada de newsletters desde templates predefinidos.
- Soportar generación asistida por IA para asunto, preheader, titulares, cuerpo, CTA y cierre.
- Soportar estados de revisión y aprobación: borrador, en revisión, requiere cambios, aprobado, archivado.
- Preservar trazabilidad de versiones, comentarios, aprobaciones y exportaciones.
- Exportar a HTML/MJML, PDF y preview web interna.
- No implementar envío automático de emails salvo pedido explícito.

### Reglas de ingeniería

- Usar `pnpm`; no introducir lockfiles de `npm` ni `yarn`.
- Mantener los cambios acotados al pedido del usuario.
- No editar ni commitear valores de `.env`, credenciales, API keys o secretos.
- No exponer `CLIENT_ID`, `CLIENT_SECRET`, claves de Supabase ni credenciales de IA en logs o respuestas HTTP.
- No revertir cambios existentes del usuario salvo pedido explícito.
- Preferir patrones existentes del proyecto antes que nuevas abstracciones.
- Agregar dependencias solo cuando sean claramente necesarias.
- Correr los comandos de validación más relevantes antes de finalizar.

### Guía de integración IA

La integración práctica actual es el endpoint Nestle GenIA/Cloudhub usando `CLIENT_ID` y `CLIENT_SECRET`. No agregar LangChain solo porque aparece en el documento de planificación. Agregar LangChain únicamente cuando una tarea necesite chains, tools, agentes, memoria, RAG o abstracción de proveedores.

### Git y reviews

- Mantener PRs chicos y revisables.
- Los resúmenes deben mencionar archivos modificados y comandos de validación ejecutados.
- En code reviews, priorizar riesgos de bugs, tests faltantes, seguridad y comportamiento de producto.
