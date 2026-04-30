CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'area_name') THEN
        CREATE TYPE public.area_name AS ENUM (
            'COMUNICACION_INTERNA',
            'COMUNICACION_CORPORATIVA'
        );
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_type') THEN
        CREATE TYPE public.asset_type AS ENUM (
            'IMAGE',
            'ICON',
            'LOGO',
            'SHAPE',
            'LOCKUP',
            'KEYWORD'
        );
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'block_content_type') THEN
        CREATE TYPE public.block_content_type AS ENUM (
            'LAYOUT',
            'BASE',
            'DIVIDER',
            'CONTENT',
            'MULTIMEDIA',
            'ICONS',
            'SPECIAL'
        );
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'newsletter_state') THEN
        CREATE TYPE public.newsletter_state AS ENUM (
            'DRAFT',
            'IN_REVIEW',
            'CHANGES_REQUESTED',
            'RESUBMITTED',
            'APPROVED',
            'DISCARDED'
        );
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'newsletter_language') THEN
        CREATE TYPE public.newsletter_language AS ENUM ('SPA');
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'newsletter_format') THEN
        CREATE TYPE public.newsletter_format AS ENUM (
            'PORTRAIT',
            'LANDSCAPE'
        );
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM (
            'ADMIN',
            'FUNCTIONAL',
            'USER'
        );
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_state') THEN
        CREATE TYPE public.user_state AS ENUM (
            'ACTIVE',
            'INACTIVE',
            'REMOVED'
        );
    END IF;
END
$$;

CREATE TABLE public.areas (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name public.area_name NOT NULL UNIQUE,
    CONSTRAINT areas_pkey PRIMARY KEY (id)
);

CREATE TABLE public.assets (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    url text NOT NULL,
    description text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    type public.asset_type NOT NULL,
    CONSTRAINT assets_pkey PRIMARY KEY (id)
);

CREATE TABLE public.block_content (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    content text,
    display_order integer,
    must_fill boolean NOT NULL DEFAULT false,
    type public.block_content_type NOT NULL,
    CONSTRAINT block_content_pkey PRIMARY KEY (id)
);

CREATE TABLE public.colors (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    hex text NOT NULL UNIQUE,
    CONSTRAINT colors_pkey PRIMARY KEY (id)
);

CREATE TABLE public.export_types (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    CONSTRAINT export_types_pkey PRIMARY KEY (id)
);

CREATE TABLE public.fonts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT fonts_pkey PRIMARY KEY (id)
);

CREATE TABLE public.permission_categories (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE CHECK (code ~ '^[A-Z0-9_]+$'::text),
    name text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT permission_categories_pkey PRIMARY KEY (id)
);

CREATE TABLE public.template_states (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    CONSTRAINT template_states_pkey PRIMARY KEY (id)
);

CREATE TABLE public.users (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    area_id uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    role public.user_role NOT NULL DEFAULT 'USER'::public.user_role,
    state public.user_state NOT NULL DEFAULT 'ACTIVE'::public.user_state,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.brand_kit (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    font_id uuid,
    created_by_user_id uuid,
    name text NOT NULL,
    active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT brand_kit_pkey PRIMARY KEY (id)
);

CREATE TABLE public.exports (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    export_type_id uuid NOT NULL,
    CONSTRAINT exports_pkey PRIMARY KEY (id)
);

CREATE TABLE public.permissions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    category_id uuid NOT NULL,
    code text NOT NULL UNIQUE CHECK (code ~ '^[A-Z0-9_]+$'::text),
    description text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT permissions_pkey PRIMARY KEY (id)
);

CREATE TABLE public.templates (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    area_id uuid,
    layout text,
    state_id uuid NOT NULL,
    prompt_base text,
    created_by_user_id uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT templates_pkey PRIMARY KEY (id)
);

CREATE TABLE public.assets_block (
    block_id uuid NOT NULL,
    asset_id uuid NOT NULL,
    CONSTRAINT assets_block_pkey PRIMARY KEY (block_id, asset_id)
);

CREATE TABLE public.brandkit_assets (
    brand_kit_id uuid NOT NULL,
    asset_id uuid NOT NULL,
    CONSTRAINT brandkit_assets_pkey PRIMARY KEY (brand_kit_id, asset_id)
);

CREATE TABLE public.color_palette (
    brand_kit_id uuid NOT NULL,
    color_id uuid NOT NULL,
    CONSTRAINT color_palette_pkey PRIMARY KEY (brand_kit_id, color_id)
);

CREATE TABLE public.commentary (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    block_content_id uuid,
    commented_by_user_id uuid,
    show boolean NOT NULL DEFAULT true,
    content text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT commentary_pkey PRIMARY KEY (id)
);

CREATE TABLE public.hyperlinks (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    block_content_id uuid,
    url text NOT NULL,
    label text,
    CONSTRAINT hyperlinks_pkey PRIMARY KEY (id)
);

CREATE TABLE public.newsletters (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL,
    area_id uuid,
    theme_tag text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    publish_date timestamp with time zone,
    brand_kit_id uuid,
    template_id uuid,
    approved_by_user_id uuid,
    created_by_user_id uuid,
    state public.newsletter_state NOT NULL DEFAULT 'DRAFT'::public.newsletter_state,
    language public.newsletter_language NOT NULL DEFAULT 'SPA'::public.newsletter_language,
    format public.newsletter_format NOT NULL DEFAULT 'PORTRAIT'::public.newsletter_format,
    CONSTRAINT newsletters_pkey PRIMARY KEY (id)
);

CREATE TABLE public.newsletter_blocks (
    newsletter_id uuid NOT NULL,
    block_content_id uuid NOT NULL,
    display_order integer,
    row integer,
    grid_column integer,
    CONSTRAINT newsletter_blocks_pkey PRIMARY KEY (newsletter_id, block_content_id)
);

CREATE TABLE public.newsletter_exports (
    export_id uuid NOT NULL,
    newsletter_id uuid NOT NULL,
    url_file text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT newsletter_exports_pkey PRIMARY KEY (export_id, newsletter_id)
);

CREATE TABLE public.newsletter_state_log (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    newsletter_id uuid NOT NULL,
    previous_state text,
    new_state text,
    reviewed_by_user_id uuid,
    all_commentaries text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT newsletter_state_log_pkey PRIMARY KEY (id)
);

CREATE TABLE public.role_permissions (
    role public.user_role NOT NULL,
    permission_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT role_permissions_pkey PRIMARY KEY (role, permission_id)
);

ALTER TABLE public.users
    ADD CONSTRAINT users_area_id_fkey
    FOREIGN KEY (area_id) REFERENCES public.areas(id);

ALTER TABLE public.brand_kit
    ADD CONSTRAINT brand_kit_font_id_fkey
    FOREIGN KEY (font_id) REFERENCES public.fonts(id);

ALTER TABLE public.brand_kit
    ADD CONSTRAINT brand_kit_created_by_user_id_fkey
    FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);

ALTER TABLE public.exports
    ADD CONSTRAINT exports_export_type_id_fkey
    FOREIGN KEY (export_type_id) REFERENCES public.export_types(id);

ALTER TABLE public.permissions
    ADD CONSTRAINT permissions_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES public.permission_categories(id);

ALTER TABLE public.templates
    ADD CONSTRAINT templates_area_id_fkey
    FOREIGN KEY (area_id) REFERENCES public.areas(id);

ALTER TABLE public.templates
    ADD CONSTRAINT templates_state_id_fkey
    FOREIGN KEY (state_id) REFERENCES public.template_states(id);

ALTER TABLE public.templates
    ADD CONSTRAINT templates_created_by_user_id_fkey
    FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);

ALTER TABLE public.assets_block
    ADD CONSTRAINT assets_block_block_id_fkey
    FOREIGN KEY (block_id) REFERENCES public.block_content(id);

ALTER TABLE public.assets_block
    ADD CONSTRAINT assets_block_asset_id_fkey
    FOREIGN KEY (asset_id) REFERENCES public.assets(id);

ALTER TABLE public.brandkit_assets
    ADD CONSTRAINT brandkit_assets_brand_kit_id_fkey
    FOREIGN KEY (brand_kit_id) REFERENCES public.brand_kit(id);

ALTER TABLE public.brandkit_assets
    ADD CONSTRAINT brandkit_assets_asset_id_fkey
    FOREIGN KEY (asset_id) REFERENCES public.assets(id);

ALTER TABLE public.color_palette
    ADD CONSTRAINT color_palette_brand_kit_id_fkey
    FOREIGN KEY (brand_kit_id) REFERENCES public.brand_kit(id);

ALTER TABLE public.color_palette
    ADD CONSTRAINT color_palette_color_id_fkey
    FOREIGN KEY (color_id) REFERENCES public.colors(id);

ALTER TABLE public.commentary
    ADD CONSTRAINT commentary_block_content_id_fkey
    FOREIGN KEY (block_content_id) REFERENCES public.block_content(id);

ALTER TABLE public.commentary
    ADD CONSTRAINT commentary_commented_by_user_id_fkey
    FOREIGN KEY (commented_by_user_id) REFERENCES public.users(id);

ALTER TABLE public.hyperlinks
    ADD CONSTRAINT hyperlinks_block_content_id_fkey
    FOREIGN KEY (block_content_id) REFERENCES public.block_content(id);

ALTER TABLE public.newsletters
    ADD CONSTRAINT newsletters_area_id_fkey
    FOREIGN KEY (area_id) REFERENCES public.areas(id);

ALTER TABLE public.newsletters
    ADD CONSTRAINT newsletters_brand_kit_id_fkey
    FOREIGN KEY (brand_kit_id) REFERENCES public.brand_kit(id);

ALTER TABLE public.newsletters
    ADD CONSTRAINT newsletters_template_id_fkey
    FOREIGN KEY (template_id) REFERENCES public.templates(id);

ALTER TABLE public.newsletters
    ADD CONSTRAINT newsletters_approved_by_user_id_fkey
    FOREIGN KEY (approved_by_user_id) REFERENCES public.users(id);

ALTER TABLE public.newsletters
    ADD CONSTRAINT newsletters_created_by_user_id_fkey
    FOREIGN KEY (created_by_user_id) REFERENCES public.users(id);

ALTER TABLE public.newsletter_blocks
    ADD CONSTRAINT newsletter_blocks_newsletter_id_fkey
    FOREIGN KEY (newsletter_id) REFERENCES public.newsletters(id);

ALTER TABLE public.newsletter_blocks
    ADD CONSTRAINT newsletter_blocks_block_content_id_fkey
    FOREIGN KEY (block_content_id) REFERENCES public.block_content(id);

ALTER TABLE public.newsletter_exports
    ADD CONSTRAINT newsletter_exports_export_id_fkey
    FOREIGN KEY (export_id) REFERENCES public.exports(id);

ALTER TABLE public.newsletter_exports
    ADD CONSTRAINT newsletter_exports_newsletter_id_fkey
    FOREIGN KEY (newsletter_id) REFERENCES public.newsletters(id);

ALTER TABLE public.newsletter_state_log
    ADD CONSTRAINT newsletter_state_log_newsletter_id_fkey
    FOREIGN KEY (newsletter_id) REFERENCES public.newsletters(id);

ALTER TABLE public.newsletter_state_log
    ADD CONSTRAINT newsletter_state_log_reviewed_by_user_id_fkey
    FOREIGN KEY (reviewed_by_user_id) REFERENCES public.users(id);

ALTER TABLE public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey
    FOREIGN KEY (permission_id) REFERENCES public.permissions(id);
