import { useMemo } from 'react'

import { useBookingsAwaitingReaction } from 'features/bookings/helpers/useBookingsAwaitingReaction'
import { TabParamList } from 'features/navigation/TabBar/types'

export const useTabBarItemBadges = (): Partial<Record<keyof TabParamList, number>> => {
  const bookingsBadge = useBookingsAwaitingReaction()

  const routeBadgeMap = useMemo(
    () => ({
      Bookings: bookingsBadge,
    }),
    [bookingsBadge]
  )

  return routeBadgeMap
}
