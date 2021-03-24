import { useMemo } from 'react'

import { useUserProfileInfo } from 'features/home/api'
import { computeCredit } from 'features/profile/utils'

export type Credit = { amount: number; isExpired: boolean }

export const useAvailableCredit = (): Credit | undefined => {
  const { data: user } = useUserProfileInfo()
  return useMemo(() => {
    if (!user) {
      return undefined
    }

    return {
      amount: computeCredit(user.domainsCredit),
      isExpired: user.depositExpirationDate
        ? new Date(user.depositExpirationDate) < new Date()
        : false,
    }
  }, [user])
}
