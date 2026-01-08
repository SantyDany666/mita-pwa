# Project Mita PWA

## Overview
This is a **Web-First, Mobile-Native** application built with modern web technologies. It follows a **Feature-Driven Design** architecture to ensure scalability and maintainability.

## Tech Stack
- **Framework:** Vite + React 19 (TypeScript)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Routing:** TanStack Router (File-based)
- **State Management:** TanStack Query (Server state) + Zustand (Client state)
- **Validation:** Zod
- **Mobile Runtime:** Capacitor

## Architecture: Feature-Driven Design
The project structure is organized to support scalability:

- \`src/api/\`: API clients and Axios/Fetch configurations.
- \`src/components/ui/\`: Atomic, reusable UI components (Shadcn/UI).
- \`src/features/\`: Feature-based modules containing specific logic, components, and hooks.
- \`src/hooks/\`: Global hooks shared across features.
- \`src/lib/\`: Configuration for external libraries (utils, constants).
- \`src/services/\`: Abstractions for external services (Notifications, Analytics).
- \`src/store/\`: Global client state management (Zustand).
- \`src/types/\`: Global TypeScript definitions.

## Key Configurations
- **Strict TypeScript:** Enabled for maximum type safety.
- **Path Aliases:** Use \`@/...\` to import from \`src/\`.
- **Linting:** ESLint + Prettier configured for code quality.

## Getting Started
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`
