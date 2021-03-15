import { useUserProfileInfo } from 'features/home/api'
import { computeWalletBalance } from 'features/profile/utils'

export type Credit = { amount: number; isExpired: boolean }

export const useAvailableCredit = (): Credit | undefined => {
  const { data: user } = useUserProfileInfo()
  if (!user) return undefined

  const isExpired = user.depositExpirationDate
    ? new Date(user.depositExpirationDate) < new Date()
    : false

  return { amount: computeWalletBalance(user.expenses), isExpired }
}
