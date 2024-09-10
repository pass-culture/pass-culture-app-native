import React from 'react'

import { BicolorBookingsCountV2 } from 'features/bookings/components/BicolorBookingsCountV2'
import { BicolorBookings } from 'ui/svg/icons/BicolorBookings'
import { BicolorBookingsV2 } from 'ui/svg/icons/BicolorBookingsV2'
import { BicolorFavorite } from 'ui/svg/icons/BicolorFavorite'
import { BicolorFavoriteV2 } from 'ui/svg/icons/BicolorFavoriteV2'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorSearch } from 'ui/svg/icons/BicolorSearch'
import { BicolorSearchV2 } from 'ui/svg/icons/BicolorSearchV2'
import { BicolorTabBarProfile } from 'ui/svg/icons/BicolorTabBarProfile'
import { BicolorTabBarProfileV2 } from 'ui/svg/icons/BicolorTabBarProfileV2'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'

import { TabRouteName } from './types'

type Props = {
  route: TabRouteName
  v2: boolean
  enableReactionFeature: boolean
}

export function mapTabRouteToBicolorIcon({
  route,
  v2,
  enableReactionFeature,
}: Props): React.FC<AccessibleBicolorIcon> {
  const BicolorBookingsIcon = enableReactionFeature ? BicolorBookingsCountV2 : BicolorBookingsV2
  switch (route) {
    case 'Home':
      return BicolorLogo
    case 'SearchStackNavigator':
      return v2 ? BicolorSearchV2 : BicolorSearch
    case 'Bookings':
      return v2 ? BicolorBookingsIcon : BicolorBookings
    case 'Favorites':
      return v2 ? BicolorFavoriteV2 : BicolorFavorite
    case 'Profile':
      return v2 ? BicolorTabBarProfileV2 : BicolorTabBarProfile
    default:
      return BicolorLogo
  }
}
