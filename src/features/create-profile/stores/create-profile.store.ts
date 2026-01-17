import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Step1Data, Step2Data, Step3Data, ProfileData } from '../schemas/profile-schemas'

interface CreateProfileState {
  step1: Step1Data | null
  step2: Step2Data | null
  step3: Step3Data | null

  setStep1: (data: Step1Data) => void
  setStep2: (data: Step2Data | null) => void // Nullable for "Skip"
  setStep3: (data: Step3Data | null) => void // Nullable for "Skip"

  // Helper to get all data
  getProfileData: () => Partial<ProfileData>

  reset: () => void
}

export const useCreateProfileStore = create<CreateProfileState>()(
  persist(
    (set, get) => ({
      step1: null,
      step2: null,
      step3: null,

      setStep1: (data) => set({ step1: data }),
      setStep2: (data) => set({ step2: data }),
      setStep3: (data) => set({ step3: data }),

      getProfileData: () => {
        const { step1, step2, step3 } = get()
        return {
          ...step1,
          ...step2,
          ...step3,
        }
      },

      reset: () => set({ step1: null, step2: null, step3: null }),
    }),
    {
      name: 'create-profile-storage',
    }
  )
)
