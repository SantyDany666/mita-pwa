import { createFileRoute } from '@tanstack/react-router'
import { Step2BodyInfo } from '../../features/create-profile/pages/Step2BodyInfo'

export const Route = createFileRoute('/create-profile/step-2')({
  component: Step2BodyInfo,
})
