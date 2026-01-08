# SYSTEM & ARCHITECTURE RULES

## 1. Golden Stack (Strict Compliance)
- **Runtime:** React 19 + Vite + TypeScript (Strict Mode).
- **Navigation:** TanStack Router (File-based, Type-safe).
- **Data Fetching:** TanStack Query v5 (Use Hooks only).
- **Global State:** Zustand (Small, atomic stores).
- **Forms & Validation:** React Hook Form + Zod schemas.
- **Mobile bridge:** Capacitor (Must use service abstractions).
- **UI System:** Tailwind CSS + Shadcn UI (Radix primitives).

## 2. Structural Requirements (No-Legacy)
- **Feature-Driven Design:** Every new logic must be encapsulated in `src/features/{feature-name}/`.
- **Logic Separation:** Components should be "dumb" (UI only). All business logic, API calls, and state transformations MUST live in custom hooks within the feature folder.
- **The Service Pattern:** - Native hardware features (Notifications, Camera, Storage) must be accessed via a generic interface in `src/services/`.
    - Component -> Hook -> Service -> Capacitor/Web API.
- **Strict Typing:** No `any`. Use `satisfies` for object literals and `z.infer<T>` for API responses.

## 3. Implementation Checklist (Mandatory for AI)
Before generating code, verify:
1. **PWA & Mobile-First:** Is the UI responsive and touch-friendly? (Use `h-dvh` for screens, safe-areas).
2. **Atomic UI:** Are we reusing `src/components/ui/` or creating redundant styles?
3. **Data Integrity:** Are all API responses validated with Zod before entering the state?
4. **Error Boundaries:** Is there a fallback UI for failed data fetching or crashes?

## 4. Prohibited Patterns (The "Never" List)
- NO `useEffect` for data fetching.
- NO `prop drilling` (more than 2 levels).
- NO `index.ts` barrel files that cause circular dependencies.
- NO inline styles or hardcoded magic numbers.
- NO "Legacy React" (Class components or `create-react-app` style).