import { useUserProfileInfo } from 'features/home/api'
import { computeWalletBalance } from 'features/profile/utils'

export const useAvailableCredit = (): { amount: number; isExpired: boolean } | undefined => {
  const { data: user } = useUserProfileInfo()
  if (!user) return undefined

  const isExpired = user.depositExpirationDate
    ? new Date(user.depositExpirationDate) < new Date()
    : false

  return { amount: computeWalletBalance(user.expenses), isExpired }
}
