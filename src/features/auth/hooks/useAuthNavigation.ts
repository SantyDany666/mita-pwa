import { useNavigate } from '@tanstack/react-router'

export const useAuthNavigation = () => {
  const navigate = useNavigate()

  const navigateToHome = () => navigate({ to: '/' })
  const navigateToLogin = () => navigate({ to: '/login' })
  const navigateToOtp = () => navigate({ to: '/otp' })

  return {
    navigateToHome,
    navigateToLogin,
    navigateToOtp,
  }
}
