import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '../services/auth.service'

import { useNavigate } from '@tanstack/react-router'

const phoneSchema = z.object({
  phone: z.string().min(10, 'Número de teléfono inválido'), // Basic validation, react-international-phone helps with structure
})

type PhoneFormValues = z.infer<typeof phoneSchema>

export const usePhoneLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Direct router navigation for passing search params
  const navigate = useNavigate()

  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: '',
    },
  })

  const onSubmit = async (values: PhoneFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      // Remove any spaces or formatting if strictly needed, 
      // but usually the component returns E.164
      await authService.signInWithPhone(values.phone)
      
      // Navigate using TanStack Router with search params
      await navigate({ 
        to: '/otp',
        search: { phone: values.phone }
      })
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error al enviar el código de verificación')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    onSubmit,
    isLoading,
    error,
  }
}
