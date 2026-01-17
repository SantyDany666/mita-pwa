import { createFileRoute } from '@tanstack/react-router'
import { Step1BasicInfo } from '../../features/create-profile/pages/Step1BasicInfo'

export const Route = createFileRoute('/create-profile/')({
  component: Step1BasicInfo,
})
