import React from 'react'

import { BookingsCountV2 } from 'features/bookings/components/BookingsCountV2'
import { Bookings } from 'ui/svg/icons/Bookings'
import { Favorite } from 'ui/svg/icons/Favorite'
import { LogoDetailed } from 'ui/svg/icons/LogoDetailed'
import { Search } from 'ui/svg/icons/Search'
import { TabBarProfile } from 'ui/svg/icons/TabBarProfile'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'

import { TabRouteName } from './types'

type Props = {
  route: TabRouteName
  enableReactionFeature: boolean
}

export function mapTabRouteToBicolorIcon({
  route,
  enableReactionFeature,
}: Props): React.FC<AccessibleBicolorIcon> {
  const BicolorBookingsIcon = enableReactionFeature ? BookingsCountV2 : Bookings
  switch (route) {
    case 'Home':
      return LogoDetailed
    case 'SearchStackNavigator':
      return Search
    case 'Bookings':
      return BicolorBookingsIcon
    case 'Favorites':
      return Favorite
    case 'Profile':
      return TabBarProfile
    default:
      return LogoDetailed
  }
}
