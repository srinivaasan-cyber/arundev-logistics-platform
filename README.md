# Arundev Logistics Integrated Logistics Operating Platform (ADL)

A purpose-built internal/customer logistics operating platform for Arundev Logistics.

## Architecture

### Technology Stack

- **React 19** + **TypeScript** — UI framework with strict typing
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — utility-first styling with a custom design system
- **React Router v7** — client-side routing with protected routes
- **Supabase** — authentication, PostgreSQL database, and RBAC storage

### Project Structure

```
src/
├── main.tsx                  # Application entry point
├── App.tsx                   # Root router and route definitions
├── index.css                 # Tailwind theme + component classes
├── lib/
│   └── supabase.ts           # Supabase client singleton (anon key only)
├── types/
│   └── database.ts           # TypeScript types for DB entities
├── auth/
│   ├── AuthContext.tsx       # Auth provider: session, profile, RBAC loading
│   └── ProtectedRoute.tsx    # Route guard: auth + user-type + role checks
├── components/
│   ├── AppShell.tsx          # Responsive sidebar + topbar layout
│   ├── Logo.tsx              # Brand logo
│   ├── Icons.tsx             # SVG icon components
│   ├── FullScreenLoader.tsx  # Loading state
│   └── PagePlaceholder.tsx   # Empty-state placeholder for future modules
├── layouts/
│   ├── StaffLayout.tsx       # Staff portal nav config + shell
│   ├── CustomerLayout.tsx    # Customer portal nav config + shell
│   └── DriverLayout.tsx      # Driver portal nav config + shell
└── pages/
    ├── LoginPage.tsx         # Email/password sign-in
    ├── UnauthorizedPage.tsx  # 403 access denied
    ├── AccountDisabledPage.tsx
    ├── NotFoundPage.tsx      # 404
    ├── staff/                # Staff portal pages
    ├── customer/             # Customer portal pages
    └── driver/               # Driver portal pages
```

### Database Schema

The RBAC schema lives in the Supabase `public` schema:

| Table | Purpose |
|---|---|
| `profiles` | User profile linked to `auth.users` via `id`; `user_type` column (CUSTOMER, DRIVER, PARTNER, STAFF) determines portal access |
| `roles` | Staff role definitions (OWNER, ADMIN, OPERATIONS_MANAGER, DISPATCHER, FLEET_MANAGER, FINANCE, SALES) |
| `permissions` | Granular permissions keyed by `resource` + `action` (view, create, update, delete, manage) |
| `user_roles` | Junction: which users have which roles |
| `role_permissions` | Junction: which roles grant which permissions |

**RLS policies** ensure users can only read their own profile, their own role assignments, and the role/permission definitions needed for authorization checks. A database trigger auto-creates a `profiles` row when a new user signs up.

### Authentication & Authorization Flow

1. User signs in via `LoginPage` using Supabase email/password auth.
2. `AuthContext` listens to `onAuthStateChange` and loads the user's session.
3. On session established, the context fetches:
   - The user's `profiles` row (determines `user_type` → which portal)
   - The user's `user_roles` → `roles` (determines staff role(s))
   - Each role's `role_permissions` → `permissions` (determines what they can do)
4. `ProtectedRoute` checks:
   - Is there a session? If not, redirect to `/login`.
   - Is the profile active? If not, redirect to `/account-disabled`.
   - Does the `user_type` match the portal? If not, redirect to `/unauthorized`.
   - If `allowedRoles` is specified, does the user have one (or is OWNER)? If not, redirect to `/unauthorized`.
5. The OWNER role implicitly passes all permission checks (enforced in `hasPermission`).

### Three Portal Areas

| Portal | Route prefix | Allowed user types | Key roles |
|---|---|---|---|
| Staff Portal | `/staff` | STAFF | OWNER, ADMIN, OPERATIONS_MANAGER, DISPATCHER, FLEET_MANAGER, FINANCE, SALES |
| Customer Portal | `/customer` | CUSTOMER, PARTNER | — |
| Driver Portal | `/driver` | DRIVER | — |

### Design System

- 6 color ramps: primary (blue), secondary (slate), accent (green), success, warning, error
- 8px spacing system via Tailwind defaults
- Inter font family
- Responsive: collapsible sidebar on mobile, persistent on desktop (lg+)

## Development Rules

1. **The Supabase database is authoritative.** Do not create mock data or substitute localStorage.
2. **Never expose the service-role key** in frontend code. Only the anon key is used.
3. **Do not hardcode** vehicle/driver/customer/trip counts or other operational data.
4. **Do not create or modify** Supabase RLS policies, database functions, or migrations without explicit instruction.
5. **Use existing schema as source of truth.** Inspect the database before writing data-access code.
6. **Do not build operational modules** until the foundation is reviewed and approved.

## Development

```bash
npm install      # Install dependencies
npm run dev      # Start dev server
npm run build    # Type-check + production build
npm run typecheck # Type-check only
```

### Environment Variables

The following are pre-configured in `.env`:

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key
