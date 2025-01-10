import React from 'react'

import { BicolorBookingsCountV2 } from 'features/bookings/components/BicolorBookingsCountV2'
import { BicolorBookingsV2 } from 'ui/svg/icons/BicolorBookingsV2'
import { BicolorFavoriteV2 } from 'ui/svg/icons/BicolorFavoriteV2'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorSearchV2 } from 'ui/svg/icons/BicolorSearchV2'
import { BicolorTabBarProfileV2 } from 'ui/svg/icons/BicolorTabBarProfileV2'
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
  const BicolorBookingsIcon = enableReactionFeature ? BicolorBookingsCountV2 : BicolorBookingsV2
  switch (route) {
    case 'Home':
      return BicolorLogo
    case 'SearchStackNavigator':
      return BicolorSearchV2
    case 'Bookings':
      return BicolorBookingsIcon
    case 'Favorites':
      return BicolorFavoriteV2
    case 'Profile':
      return BicolorTabBarProfileV2
    default:
      return BicolorLogo
  }
}
