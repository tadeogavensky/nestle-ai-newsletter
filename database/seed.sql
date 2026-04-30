-- =========================
-- SEED MÍNIMO - RBAC + ÁREAS + USUARIOS DE PRUEBA
-- =========================

-- =========================
-- CATEGORÍAS DE PERMISOS
-- =========================

INSERT INTO public.permission_categories (code, name) VALUES
('ACCESS_MANAGEMENT', 'Gestión de Accesos'),
('CONFIGURATION', 'Configuración'),
('TEMPLATES', 'Plantillas'),
('CONTENT', 'Contenido'),
('REVIEW', 'Revisión'),
('TRACEABILITY', 'Trazabilidad')
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name;

-- =========================
-- PERMISOS
-- =========================

INSERT INTO public.permissions (category_id, code, description)
SELECT pc.id, v.code, v.description
FROM (
  VALUES
    ('ACCESS_MANAGEMENT', 'USER_MANAGE', 'Alta/Baja de usuarios'),
    ('ACCESS_MANAGEMENT', 'ROLE_ASSIGN', 'Asignación de roles'),
    ('ACCESS_MANAGEMENT', 'SECURITY_POLICY_DEFINE', 'Definición de políticas de seguridad y acceso'),

    ('CONFIGURATION', 'PROMPT_MANAGE', 'Backoffice y gestión de Prompts de IA'),
    ('CONFIGURATION', 'BRAND_MANAGE', 'Gestión de estilos de marca'),

    ('TEMPLATES', 'TEMPLATE_CREATE_RETIRE', 'Creación y retiro de templates corporativos'),
    ('TEMPLATES', 'TEMPLATE_EDIT', 'Edición de templates'),
    ('TEMPLATES', 'TEMPLATE_VIEW_COPY', 'Ver y copiar templates existentes'),

    ('CONTENT', 'CONTENT_GENERATE_AI', 'Generación de contenido vía IA'),
    ('CONTENT', 'CONTENT_UPLOAD', 'Carga de contenido y archivos'),
    ('CONTENT', 'CONTENT_EXPORT_APPROVED', 'Exportación de contenidos aprobados'),

    ('REVIEW', 'REVIEW_REQUEST_PREVIEW', 'Solicitud de revisión y previsualización'),
    ('REVIEW', 'REVIEW_COMMENT_CREATE', 'Crear comentarios de revisión'),
    ('REVIEW', 'REVIEW_COMMENT_VIEW_REPLY', 'Ver y responder a comentarios de revisión'),
    ('REVIEW', 'REVIEW_FINAL_APPROVE_COMMENT', 'Aprobación final y comentarios'),

    ('TRACEABILITY', 'AUDIT_LOGS_METRICS_VIEW', 'Logs de auditoría y métricas de uso')
) AS v(category_code, code, description)
JOIN public.permission_categories pc
  ON pc.code = v.category_code
ON CONFLICT (code) DO UPDATE
SET
  category_id = EXCLUDED.category_id,
  description = EXCLUDED.description;

-- =========================
-- PERMISOS POR ROL
-- =========================

-- ADMIN: todos los permisos
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'ADMIN'::user_role, id
FROM public.permissions
ON CONFLICT (role, permission_id) DO NOTHING;

-- FUNCTIONAL: administrador funcional
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'FUNCTIONAL'::user_role, id
FROM public.permissions
WHERE code IN (
  'ROLE_ASSIGN',
  'TEMPLATE_EDIT',
  'TEMPLATE_VIEW_COPY',
  'CONTENT_UPLOAD',
  'CONTENT_EXPORT_APPROVED',
  'REVIEW_REQUEST_PREVIEW',
  'REVIEW_COMMENT_CREATE',
  'REVIEW_COMMENT_VIEW_REPLY',
  'REVIEW_FINAL_APPROVE_COMMENT',
  'AUDIT_LOGS_METRICS_VIEW'
)
ON CONFLICT (role, permission_id) DO NOTHING;

-- USER: usuario general
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'USER'::user_role, id
FROM public.permissions
WHERE code IN (
  'CONTENT_GENERATE_AI',
  'CONTENT_UPLOAD',
  'CONTENT_EXPORT_APPROVED',
  'REVIEW_REQUEST_PREVIEW',
  'REVIEW_COMMENT_VIEW_REPLY'
)
ON CONFLICT (role, permission_id) DO NOTHING;

-- =========================
-- ÁREAS
-- =========================

INSERT INTO public.areas (name) VALUES
('COMUNICACION_INTERNA'::area_name),
('COMUNICACION_CORPORATIVA'::area_name)
ON CONFLICT (name) DO NOTHING;


-- =========================
-- USUARIOS DE PRUEBA
-- =========================

INSERT INTO public.users (
  name,
  last_name,
  email,
  area_id,
  role,
  state
)
SELECT
  v.name,
  v.last_name,
  v.email,
  a.id,
  v.role::user_role,
  'ACTIVE'::user_state
FROM (
  VALUES
    ('Admin', 'Local', 'admin@local.test', 'COMUNICACION_INTERNA', 'ADMIN'),
    ('Functional', 'Local', 'functional@local.test', 'COMUNICACION_INTERNA', 'FUNCTIONAL'),
    ('User', 'Local', 'user@local.test', 'COMUNICACION_CORPORATIVA', 'USER')
) AS v(name, last_name, email, area_name, role)
JOIN public.areas a
  ON a.name = v.area_name::area_name
ON CONFLICT (email) DO UPDATE
SET
  name = EXCLUDED.name,
  last_name = EXCLUDED.last_name,
  area_id = EXCLUDED.area_id,
  role = EXCLUDED.role,
  state = EXCLUDED.state;