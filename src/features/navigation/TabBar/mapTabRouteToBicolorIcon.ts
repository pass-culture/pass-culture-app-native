import React from 'react'

import { BookingsCountV2 } from 'features/bookings/components/BookingsCountV2'
import { Favorite } from 'ui/svg/icons/Favorite'
import { LogoDetailed } from 'ui/svg/icons/LogoDetailed'
import { Search } from 'ui/svg/icons/Search'
import { TabBarProfile } from 'ui/svg/icons/TabBarProfile'
import { AccessibleIcon } from 'ui/svg/icons/types'

import { TabRouteName } from './TabStackNavigatorTypes'

type Props = {
  route: TabRouteName
}

export function mapTabRouteToIcon({ route }: Props): React.FC<AccessibleIcon> {
  switch (route) {
    case 'Home':
      return LogoDetailed
    case 'SearchStackNavigator':
      return Search
    case 'Bookings':
      return BookingsCountV2
    case 'Favorites':
      return Favorite
    case 'Profile':
      return TabBarProfile
    default:
      return LogoDetailed
  }
}
