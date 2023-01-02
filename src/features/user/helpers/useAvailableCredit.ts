import { UserProfileResponse } from 'api/gen/api'
import { useAuthContext } from 'features/auth/AuthContext'
import { computeCredit } from 'features/profile/helpers/computeCredit'

export type Credit = { amount: number; isExpired: boolean }

export const hasOngoingCredit = (user: UserProfileResponse) => {
  return user.depositExpirationDate ? new Date(user.depositExpirationDate) >= new Date() : false
}

export const getAvailableCredit = (user: UserProfileResponse): Credit => {
  return {
    amount: computeCredit(user.domainsCredit),
    isExpired: !hasOngoingCredit(user),
  }
}

export const useAvailableCredit = (): Credit | undefined => {
  const { user } = useAuthContext()

  if (!user) return undefined

  return getAvailableCredit(user)
}
