import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-primary">
        Hello World
      </h1>
      <p className="text-xl text-muted-foreground max-w-[600px]">
        Greenfield Project Initialized.
      </p>
      <div className="mt-8 p-4 border rounded-lg bg-card shadow-sm">
        <p className="font-mono text-sm">
          Vite + React 19 + Tailwind + Shadcn + TanStack
        </p>
      </div>
    </div>
  )
}
