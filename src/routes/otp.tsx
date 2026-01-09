import { createFileRoute } from '@tanstack/react-router'
import { OtpScreen } from '../features/auth/components/OtpScreen'

export const Route = createFileRoute('/otp')({
  component: OtpScreen,
})
