import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '../services/auth.service'
import { useAuthNavigation } from './useAuthNavigation'

// We might need to handle search params reading differently depending on router setup, 
// using generic window.location.search or route.useSearch if defined in strict router context.
// Safe fallback: window.location parsing implementation for "dumb" component isolation if router context is strict.

const otpSchema = z.object({
  otp: z.string().length(6, 'Código inválido'),
})

type OtpFormValues = z.infer<typeof otpSchema>

export const useAuthOtp = () => {
  const { navigateToHome, navigateToLogin } = useAuthNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Simple search param extraction for now since we are in a hurry and router types might be strict
  const getPhoneNumber = () => {
      const params = new URLSearchParams(window.location.search);
      return params.get('phone') || '';
  }

  const [phoneNumber] = useState(getPhoneNumber)
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  })

  useEffect(() => {
    if (!phoneNumber) {
      // If no phone number, redirect back to login
       navigateToLogin()
    }
  }, [phoneNumber, navigateToLogin])

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timerId)
    } else {
        setCanResend(true)
    }
  }, [timeLeft])

  const onConfirm = async (values: OtpFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.verifyOtp(phoneNumber, values.otp)
      // On success, redirect to home
      // Supabase handles the session setting automatically
      navigateToHome()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error al verificar el código')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    setIsLoading(true)
    setError(null)
    try {
        await authService.resendOtp(phoneNumber)
        // Reset timer
        setTimeLeft(60)
        setCanResend(false)
    } catch (err: any) {
        setError(err.message || 'Error al reenviar el código')
    } finally {
        setIsLoading(false)
    }
  }

  return {
    form,
    onConfirm,
    handleResend,
    timeLeft,
    canResend,
    isLoading,
    error,
    phoneNumber
  }
}
