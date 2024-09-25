import { TabNavigationState } from '@react-navigation/native'

import { GenericRoute } from 'features/navigation/RootNavigator/types'
import {
  SearchStackScreenNames,
  SearchStackParamList,
} from 'features/navigation/SearchStackNavigator/types'
import { ArrayElement } from 'libs/typesUtils/typeHelpers'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'

export type TabRouteName = keyof TabParamList

export type TabParamList = {
  Home:
    | {
        latitude?: number
        longitude?: number
        duoModal?: string
        duoName?: string
        videoModuleId?: string
      }
    | undefined
  SearchStackNavigator?: {
    screen: SearchStackScreenNames
    params: SearchStackParamList[SearchStackScreenNames]
  }
  Bookings: undefined
  Favorites: undefined
  Profile: undefined
}

export type TabNavigationStateType = TabNavigationState<TabParamList>

export type TabStateRoute = ArrayElement<TabNavigationStateType['routes']> & {
  isSelected?: boolean
}

export type TabRoute = GenericRoute<TabParamList>

export type TabInnerComponentProps = {
  isSelected?: boolean
  BicolorIcon: React.FC<AccessibleBicolorIcon>
  tabName: TabRouteName
  badgeValue?: number
}
