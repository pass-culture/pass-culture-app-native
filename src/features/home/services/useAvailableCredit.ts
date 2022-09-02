import { UserProfileResponse } from 'api/gen/api'
import { useUserProfileInfo } from 'features/profile/api'
import { computeCredit } from 'features/profile/utils'

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
  const { data: user } = useUserProfileInfo()

  if (!user) return undefined

  return getAvailableCredit(user)
}
