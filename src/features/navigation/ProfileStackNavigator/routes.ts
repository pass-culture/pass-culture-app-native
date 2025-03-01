import { LinkingOptions } from '@react-navigation/native'

import { ComponentForPathConfig } from 'features/navigation/ComponentForPathConfig'
import { ProfileStack } from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'
import { GenericRoute } from 'features/navigation/RootNavigator/types'

type ProfileStackParamList = {
  Profile: undefined
}

type ProfileStackRoute = GenericRoute<ProfileStackParamList>

const routes: ProfileStackRoute[] = [
  {
    name: 'Profile',
    component: ComponentForPathConfig,
    path: 'profil',
    options: { title: 'Mon profil' },
  },
]

const { screensConfig } = getScreensAndConfig(routes, ProfileStack.Screen)

export const profileNavigatorPathConfig: LinkingOptions<ProfileStackParamList>['config'] = {
  initialRouteName: 'Profile',
  screens: screensConfig,
}

export const profileStackRouteNames = routes.map((route) => route.name)
