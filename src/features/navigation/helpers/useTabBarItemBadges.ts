import { useMemo } from 'react'

import { TabParamList } from 'features/navigation/navigators/TabNavigator/types'
import { useAvailableReactionQuery } from 'features/reactions/queries/useAvailableReactionQuery'

export const useTabBarItemBadges = (): Partial<Record<keyof TabParamList, number>> => {
  const { data: availableReactions } = useAvailableReactionQuery()
  const numberOfReactableBookings = availableReactions?.numberOfReactableBookings

  const routeBadgeMap = useMemo(
    () => ({
      Bookings: numberOfReactableBookings,
    }),
    [numberOfReactableBookings]
  )

  return routeBadgeMap
}
