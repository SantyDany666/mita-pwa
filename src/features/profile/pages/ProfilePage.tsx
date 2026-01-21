import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { User, Stethoscope } from "lucide-react"
import { ProfileHeader } from "../components/ProfileHeader"
import { ProfileUserCard } from "../components/ProfileUserCard"
import { ProfileSection, ProfileSectionItem } from "../components/ProfileSection"
import { ProfileLogoutButton } from "../components/ProfileLogoutButton"
import { EditProfileSheet } from "../components/EditProfileSheet"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useProfile } from "../hooks/useProfile"
import { Loader2 } from "lucide-react"

export const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { profile, isLoading: profileLoading } = useProfile(user?.id)
  const [isEditOpen, setIsEditOpen] = useState(false)



  const handleBack = () => {
    navigate({ to: "/" })
  }

  const handleLogout = async () => {
    await signOut()
    navigate({ to: "/welcome" })
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#DBE4EE] dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-[#054A91] dark:text-white" />
      </div>
    )
  }

  return (
    <div className="bg-[#DBE4EE] dark:bg-gray-900 min-h-screen text-[#4B5563] dark:text-gray-300 transition-colors duration-200 font-sans pb-6">
      <ProfileHeader title="Perfil" onBack={handleBack} />

      <main className="max-w-md mx-auto pt-24 pb-8 px-4 space-y-4">
        <ProfileUserCard
          name={profile?.name || user?.email?.split('@')[0] || "Usuario"}
          email={user?.email || ""}
          avatarUrl=""
          onEdit={() => setIsEditOpen(true)}
        />

        <ProfileSection
          title="Información Personal"
          icon={<User className="text-[#00B8A5]" />}
        >

          <ProfileSectionItem
            label="Fecha de Nacimiento:"
            value={profile?.dob ? new Date(profile.dob).toLocaleDateString('es-ES', { timeZone: 'UTC' }) : "-"}
          />
          <ProfileSectionItem
            label="Sexo asignado al nacer:"
            value={profile?.gender === 'male' ? 'Hombre' : profile?.gender === 'female' ? 'Mujer' : profile?.gender || "-"}
          />
          <ProfileSectionItem
            label="Peso:"
            value={profile?.weight ? `${profile.weight} kg` : "-"}
          />
          <ProfileSectionItem
            label="Altura:"
            value={profile?.height ? `${profile.height} cm` : "-"}
            isLast
          />
        </ProfileSection>

        <ProfileSection
          title="Datos Médicos"
          icon={<Stethoscope className="text-[#00B8A5]" />}
        >
          <ProfileSectionItem
            label="Alergias:"
            value={profile?.allergies || "Ninguna"}
          />
          <ProfileSectionItem
            label="Información Adicional:"
            value={profile?.additional_info || "Sin información"}
            isLast
          />
        </ProfileSection>



        <ProfileLogoutButton onLogout={handleLogout} />
      </main>

      <EditProfileSheet
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        profile={profile}
      />
    </div>
  )
}
