import { computeCredit } from 'features/profile/helpers/computeCredit'
import { UserProfile } from 'features/share/types'

export type Credit = { amount: number; isExpired: boolean }

export const hasOngoingCredit = (user: UserProfile) => {
  const hasRemainingCredit = !!user.domainsCredit?.all.remaining
  const hasDepositExpired = user.depositExpirationDate
    ? new Date(user.depositExpirationDate) >= new Date()
    : false
  return hasRemainingCredit && hasDepositExpired
}

export const getAvailableCredit = (user?: UserProfile): Credit | undefined => {
  if (!user) return undefined
  return {
    amount: computeCredit(user.domainsCredit),
    isExpired: !hasOngoingCredit(user),
  }
}
