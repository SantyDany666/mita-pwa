import { createFileRoute } from '@tanstack/react-router'
import { Step3HealthInfo } from '../../features/create-profile/pages/Step3HealthInfo'

export const Route = createFileRoute('/create-profile/step-3')({
  component: Step3HealthInfo,
})
