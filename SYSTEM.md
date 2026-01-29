# 🧩 MITA PROJECT: SYSTEM & ARCHITECTURE RULES

## 1. Golden Stack (Strict Compliance)

- **Runtime:** React 19 + Vite + TypeScript (Strict Mode).
- **Backend-as-a-Service:** Supabase (Auth, Database, Storage, Edge Functions).
- **Navigation:** TanStack Router (File-based, Type-safe).
- **Data Fetching:** TanStack Query v5 (Use Hooks only).
- **Global State:** Zustand (Small, atomic stores).
- **Forms & Validation:** React Hook Form + Zod schemas. Local `useState` allowed for transient/atomic UI state (KISS).
- **Mobile Bridge:** Capacitor (Must use service abstractions).
- **UI System:** Tailwind CSS + Shadcn UI (Radix primitives).
- **Testing:** Vitest (Unit) + Playwright (E2E if needed).

## 2. Supabase Integration & MCP Rules

- **Database Client:** Use a single singleton instance in `src/lib/supabase.ts`.
- **Type Safety:**
  - Use `supabase gen types` to maintain synchronized TypeScript definitions.
  - All queries must be typed: `supabase.from<'table_name'>(...)`.
- **MCP Usage:** When using the Supabase MCP, the agent must:
  1. Inspect the existing schema before suggesting migrations or queries.
  2. Suggest Row Level Security (RLS) policies for every new table.
  3. Use `snake_case` for database columns and `PascalCase` for tables.
- **Logic Placement:** Do not call `supabase` directly from components.
  - **Flow:** `Component` -> `TanStack Query Hook` -> `Supabase Service`.

## 3. Structural Requirements (No-Legacy)

- **Feature-Driven Design:** Every new logic must be encapsulated in `src/features/{feature-name}/`.
- **Feature Internal Structure:**
  - `components/`: UI components specific to this feature (dumb).
  - `hooks/`: Custom hooks containing business logic and query definitions.
  - `services/`: Direct interactions with Supabase or external APIs.
  - `types/`: Feature-specific TypeScript definitions.
  - `utils/`: Pure functions and helpers.
- **Logic Separation:** Components are "dumb". All business logic, effects, and state transformations MUST live in custom hooks.
- **The Service Pattern:**
  - Hardware features (Notifications, Camera) and External APIs (Supabase) must be abstracted in `src/services/` if global, or `features/*/services` if specific.
  - **Flow:** `Component` -> `Hook` -> `Service` -> `Capacitor/Web API/Supabase`.
- **Strict Typing:** No `any`. Use `satisfies` for object literals and `z.infer<T>` for API responses.

## 4. Implementation Checklist

1. **PWA & Mobile-First:** Use `h-dvh`, `safe-area-inset`, and touch-friendly targets (min 44px).
2. **Atomic UI:** Reuse `src/components/ui/` via Shadcn. Extract reusable patterns (DRY). Avoid inline styles.
3. **Data Integrity:** Validate Supabase responses with Zod if the schema is complex.
4. **Auth Guards:** Always verify session state before rendering protected routes in TanStack Router.
5. **Offline Ready:** Leverage TanStack Query's cache for optimistic updates where possible.
6. **Dark Mode First:** All components must implement `dark:` variants. Default to `bg-gray-900` / `text-white` for dark backgrounds.
7. **Iconography:** Use `lucide-react` consistently. Ensure icons adapt to dark mode (e.g., `dark:text-[#81A4CD]`).

## 5. Development Standards

### Testing Strategy

- **Unit Testing:** Mandatory for critical business logic in `utils/` and complex `hooks/`. Use `Vitest`.
- **Component Testing:** Optional, focus on interactivity if complex.
- **No Flaked Tests:** Mock network requests using MSW or Vitest mocks; never hit the real Supabase implementation in unit tests.

### Error Handling & UX

- **Feedback:** Use `sonner`'s `toast()` for all user-facing notifications from `src/components/ui/toaster`.
- **Drawers/Modals:** Use the `Drawer` components from `src/components/ui/drawer`.
- **Loading:** Use Skeleton loaders (`src/components/ui/skeleton`) instead of spinners for initial block content.
- **API Errors:** Catch errors in Services, throw standardized errors. Hooks catch specific errors and trigger `toast.error`.

### Environment & Security

- **Required Variables:**
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- **Naming Convention:** Client-side variables must start with `VITE_`.
- **Secrets:** Never commit `.env` files. keys starting with `VITE_` are public by definition; do not put service_role keys there.

## 6. Mobile & PWA Specifics

- **Safe Areas:** Respect `safe-area-inset-top` and `safe-area-inset-bottom`. Use utility classes or padding to prevent content from being hidden behind notches or home indicators.
- **Gestures:** Implement standard mobile gestures (Swipe to Delete, Pull to Refresh) where appropriate.
- **Input Handling:** Ensure inputs do not get hidden by the virtual keyboard. Use generic `inputmode` (e.g., `numeric`, `email`) to trigger the correct keyboard layout.
- **Haptics:** Use Capacitor Haptics for significant user interactions (success, error, critical warnings).

## 7. Prohibited Patterns (The "Never" List)

- 🚫 **NO** `useEffect` for data fetching (Use TanStack Query).
- 🚫 **NO** hardcoded Supabase Keys (Use `.env` variables strictly).
- 🚫 **NO** database logic or direct Supabase calls inside UI components.
- 🚫 **NO** public tables without RLS (Row Level Security) enabled.
- 🚫 **NO** "Legacy React" (Class components or `create-react-app` style).
- 🚫 **NO** barrel files (`index.ts`) that could cause circular dependencies.
- 🚫 **NO** significant code duplication (Refactor >10 lines of repeated JSX/logic).
