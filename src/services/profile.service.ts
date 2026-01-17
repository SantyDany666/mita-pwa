import { supabase } from '@/lib/supabase'
import { ProfileData } from '@/features/create-profile/schemas/profile-schemas'

export interface Profile {
  id: string
  user_id: string
  name: string
  dob: string
  gender: 'male' | 'female'
  weight?: number | null
  height?: number | null
  allergies?: string | null
  additional_info?: string | null
  created_at: string
  updated_at: string
}

export const profileService = {
  getProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .limit(1) // In future this might be .select() for multiple
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }

    return data as Profile
  },

  createProfile: async (profileData: ProfileData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    // Parse DD/MM/YYYY to Date format (YYYY-MM-DD)
    const [day, month, year] = profileData.dob.split('/').map(Number)
    // Create date strictly from components to avoid timezone shifts on simple date
    const dob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    const payload = {
      user_id: user.id,
      name: profileData.name,
      dob,
      gender: profileData.gender,
      weight: profileData.weight ? Number(profileData.weight) : null,
      height: profileData.height ? Number(profileData.height) : null,
      allergies: profileData.allergies || null,
      additional_info: profileData.additionalInfo || null,
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data as Profile
  }
}
