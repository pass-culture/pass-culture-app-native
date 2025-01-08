import { useMemo } from 'react'

import { TabParamList } from 'features/navigation/TabBar/types'
import { useAvailableReaction } from 'features/reactions/api/useAvailableReaction'

export const useTabBarItemBadges = (): Partial<Record<keyof TabParamList, number>> => {
  const { data: availableReactions } = useAvailableReaction()
  const numberOfReactableBookings = availableReactions?.numberOfReactableBookings

  const routeBadgeMap = useMemo(
    () => ({
      Bookings: numberOfReactableBookings,
    }),
    [numberOfReactableBookings]
  )

  return routeBadgeMap
}
