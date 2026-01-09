import { createFileRoute } from '@tanstack/react-router'
import { PhoneLoginScreen } from '../features/auth/components/PhoneLoginScreen'

export const Route = createFileRoute('/login')({
  component: PhoneLoginScreen,
})
