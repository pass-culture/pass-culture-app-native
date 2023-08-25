import { useAuthContext } from 'features/auth/context/AuthContext'
import { dateDiffInFullYears } from 'libs/dates'

export const useDepositActivationAge = (): number | null | undefined => {
  const { user, isLoggedIn, isUserLoading } = useAuthContext()

  if (!isLoggedIn || isUserLoading) return undefined

  if (!user?.depositActivationDate || !user?.birthDate) return null

  const depositActivationDate = new Date(user.depositActivationDate)
  const birthDate = new Date(user.birthDate)

  return dateDiffInFullYears(birthDate, depositActivationDate)
}
