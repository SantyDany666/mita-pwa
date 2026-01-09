import { createFileRoute } from '@tanstack/react-router'
import { WelcomeScreen } from '../features/auth/components/WelcomeScreen'

export const Route = createFileRoute('/welcome')({
  component: WelcomeScreen,
})
