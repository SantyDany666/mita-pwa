import { ReactNode } from "react"

interface CreateProfileLayoutProps {
  children: ReactNode
}

export const CreateProfileLayout = ({ children }: CreateProfileLayoutProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 text-slate-800 dark:text-white antialiased min-h-screen flex flex-col">
      <div className="h-12 w-full bg-white dark:bg-gray-900 sticky top-0 z-50"></div>
      <div className="max-w-md mx-auto px-8 flex-grow flex flex-col w-full pb-10">
        {children}
      </div>
    </div>
  )
}
