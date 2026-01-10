# 🧩 MITA PROJECT: SYSTEM & ARCHITECTURE RULES

## 1. Golden Stack (Strict Compliance)
- **Runtime:** React 19 + Vite + TypeScript (Strict Mode).
- **Backend-as-a-Service:** Supabase (Auth, Database, Storage, Edge Functions).
- **Navigation:** TanStack Router (File-based, Type-safe).
- **Data Fetching:** TanStack Query v5 (Use Hooks only).
- **Global State:** Zustand (Small, atomic stores).
- **Forms & Validation:** React Hook Form + Zod schemas.
- **Mobile Bridge:** Capacitor (Must use service abstractions).
- **UI System:** Tailwind CSS + Shadcn UI (Radix primitives).

## 2. Supabase Integration & MCP Rules
- **Database Client:** Use a single singleton instance in `src/lib/supabase.ts`.
- **Type Safety:** - Use `supabase gen types` to maintain synchronized TypeScript definitions.
  - All queries must be typed: `supabase.from<'table_name'>(...)`.
- **MCP Usage:** When using the Supabase MCP, the agent must:
  1. Inspect the existing schema before suggesting migrations or queries.
  2. Suggest Row Level Security (RLS) policies for every new table.
  3. Use `snake_case` for database columns and `PascalCase` for tables.
- **Logic Placement:** Do not call `supabase` directly from components.
  - **Path:** `Component` -> `TanStack Query Hook` -> `Supabase Service`.

## 3. Structural Requirements (No-Legacy)
- **Feature-Driven Design:** Every new logic must be encapsulated in `src/features/{feature-name}/`.
- **Logic Separation:** Components are "dumb". All business logic and state transformations MUST live in custom hooks within the feature folder.
- **The Service Pattern:** - Hardware features (Notifications, Camera) and External APIs (Supabase) must be abstracted in `src/services/`.
  - **Flow:** `Component` -> `Hook` -> `Service` -> `Capacitor/Web API/Supabase`.
- **Strict Typing:** No `any`. Use `satisfies` for object literals and `z.infer<T>` for API responses.

## 4. Implementation Checklist (Mandatory for AI)
1. **PWA & Mobile-First:** Use `h-dvh`, `safe-area-inset`, and touch-friendly targets (min 44px).
2. **Atomic UI:** Reuse `src/components/ui/` via Shadcn. Avoid inline styles.
3. **Data Integrity:** Validate Supabase responses with Zod if the schema is complex.
4. **Auth Guards:** Always verify session state before rendering protected routes in TanStack Router.
5. **Offline Ready:** Leverage TanStack Query's cache for optimistic updates where possible.

## 5. Prohibited Patterns (The "Never" List)
- 🚫 **NO** `useEffect` for data fetching (Use TanStack Query).
- 🚫 **NO** hardcoded Supabase Keys (Use `.env` variables strictly).
- 🚫 **NO** database logic or direct Supabase calls inside UI components.
- 🚫 **NO** public tables without RLS (Row Level Security) enabled.
- 🚫 **NO** "Legacy React" (Class components or `create-react-app` style).
- 🚫 **NO** barrel files (`index.ts`) that could cause circular dependencies.