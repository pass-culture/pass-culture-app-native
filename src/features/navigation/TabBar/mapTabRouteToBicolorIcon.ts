import React from 'react'

import { BicolorFavoriteCount } from 'features/favorites/components/BicolorFavoriteCount'
import { BicolorBookings } from 'ui/svg/icons/BicolorBookings'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorSearch } from 'ui/svg/icons/BicolorSearch'
import { BicolorTabBarProfile } from 'ui/svg/icons/BicolorTabBarProfile'
import { BicolorIconInterface } from 'ui/svg/icons/types'

import { TabRouteName } from './types'

export function mapTabRouteToBicolorIcon(route: TabRouteName): React.FC<BicolorIconInterface> {
  switch (route) {
    case 'Home':
      return BicolorLogo
    case 'Search':
      return BicolorSearch
    case 'Bookings':
      return BicolorBookings
    case 'Favorites':
      return BicolorFavoriteCount
    case 'Profile':
      return BicolorTabBarProfile
    default:
      return BicolorLogo
  }
}
