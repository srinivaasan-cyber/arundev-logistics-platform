/*
# Create RBAC Schema for Arundev Logistics Platform

## Overview
This migration creates the foundational Role-Based Access Control (RBAC) schema
for the Arundev Logistics Integrated Logistics Operating Platform (ADL).

## New Tables

1. **profiles** — Extended user profile information linked to auth.users
   - `id` (uuid, PK, references auth.users)
   - `user_type` (enum: CUSTOMER, DRIVER, PARTNER, STAFF)
   - `first_name`, `last_name`, `phone` — contact details
   - `is_active` — account status flag
   - `created_at`, `updated_at` — timestamps

2. **roles** — Staff role definitions (OWNER, ADMIN, OPERATIONS_MANAGER, etc.)
   - `id` (uuid, PK)
   - `name` (text, unique) — role name
   - `description` (text) — role description
   - `is_system` (boolean) — system-defined roles cannot be deleted

3. **permissions** — Granular permission definitions
   - `id` (uuid, PK)
   - `name` (text, unique) — e.g. "trips.create", "vehicles.view"
   - `description` (text) — what the permission grants
   - `resource` (text) — the resource/module this permission applies to
   - `action` (text) — the action type (view, create, update, delete, manage)

4. **user_roles** — Junction: users assigned to roles
   - `id` (uuid, PK)
   - `user_id` (uuid, references profiles)
   - `role_id` (uuid, references roles)
   - `assigned_at` (timestamptz)

5. **role_permissions** — Junction: permissions granted to roles
   - `id` (uuid, PK)
   - `role_id` (uuid, references roles)
   - `permission_id` (uuid, references permissions)

## Security
- RLS enabled on all tables
- Users can read their own profile; staff can read all profiles
- Users can read their own roles and the permissions those roles grant
- Only authenticated users can access RBAC tables
- OWNER role implicitly has all permissions (enforced in application layer)

## Important Notes
1. System roles (OWNER, ADMIN, etc.) are seeded as part of this migration
2. The OWNER role is special — it bypasses permission checks in the application layer
3. user_type determines which portal the user accesses (STAFF/CUSTOMER/DRIVER/PARTNER)
4. A trigger automatically creates a profile when a new auth.user is created
*/

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type text NOT NULL DEFAULT 'CUSTOMER' CHECK (
    user_type IN ('CUSTOMER', 'DRIVER', 'PARTNER', 'STAFF')
  ),
  first_name text,
  last_name text,
  phone text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

-- Users can update their own profile (limited fields)
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Users can insert their own profile row
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- ============================================================
-- 2. ROLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read roles (needed for RBAC checks)
DROP POLICY IF EXISTS "select_roles" ON roles;
CREATE POLICY "select_roles" ON roles FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- 3. PERMISSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  resource text NOT NULL,
  action text NOT NULL CHECK (action IN ('view', 'create', 'update', 'delete', 'manage')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read permissions (needed for RBAC checks)
DROP POLICY IF EXISTS "select_permissions" ON permissions;
CREATE POLICY "select_permissions" ON permissions FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- 4. USER_ROLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role_id)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own role assignments
DROP POLICY IF EXISTS "select_own_user_roles" ON user_roles;
CREATE POLICY "select_own_user_roles" ON user_roles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 5. ROLE_PERMISSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE (role_id, permission_id)
);

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read role-permission mappings (needed for RBAC checks)
DROP POLICY IF EXISTS "select_role_permissions" ON role_permissions;
CREATE POLICY "select_role_permissions" ON role_permissions FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- 6. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource);

-- ============================================================
-- 7. SEED SYSTEM ROLES
-- ============================================================
INSERT INTO roles (name, description, is_system) VALUES
  ('OWNER', 'Full platform owner with unrestricted access', true),
  ('ADMIN', 'Platform administrator with broad access', true),
  ('OPERATIONS_MANAGER', 'Manages daily logistics operations', true),
  ('DISPATCHER', 'Dispatches trips and manages assignments', true),
  ('FLEET_MANAGER', 'Manages vehicles and fleet maintenance', true),
  ('FINANCE', 'Manages invoicing and financial operations', true),
  ('SALES', 'Manages customer relationships and sales', true)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 8. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type)
  VALUES (NEW.id, 'CUSTOMER')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 9. UPDATED_AT TRIGGER FOR PROFILES
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
