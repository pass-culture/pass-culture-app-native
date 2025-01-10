import React from 'react'

import { BicolorBookingsCountV2 } from 'features/bookings/components/BicolorBookingsCountV2'
import { BicolorBookings } from 'ui/svg/icons/BicolorBookings'
import { BicolorFavorite } from 'ui/svg/icons/BicolorFavorite'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorSearch } from 'ui/svg/icons/BicolorSearch'
import { BicolorTabBarProfile } from 'ui/svg/icons/BicolorTabBarProfile'
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
  const BicolorBookingsIcon = enableReactionFeature ? BicolorBookingsCountV2 : BicolorBookings
  switch (route) {
    case 'Home':
      return BicolorLogo
    case 'SearchStackNavigator':
      return BicolorSearch
    case 'Bookings':
      return BicolorBookingsIcon
    case 'Favorites':
      return BicolorFavorite
    case 'Profile':
      return BicolorTabBarProfile
    default:
      return BicolorLogo
  }
}
