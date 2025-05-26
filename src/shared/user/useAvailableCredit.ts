import { UserProfileResponse } from 'api/gen/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { computeCredit } from 'features/profile/helpers/computeCredit'

export type Credit = { amount: number; isExpired: boolean }

export const hasOngoingCredit = (user: UserProfileResponse) => {
  const hasRemainingCredit = !!user.domainsCredit?.all.remaining
  const hasDepositExpired = user.depositExpirationDate
    ? new Date(user.depositExpirationDate) >= new Date()
    : false
  return hasRemainingCredit && hasDepositExpired
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
