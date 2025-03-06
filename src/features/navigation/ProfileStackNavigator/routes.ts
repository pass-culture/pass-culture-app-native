import { ComponentForPathConfig } from 'features/navigation/ComponentForPathConfig'
import {
  ProfileStackRoute,
  ProfileStackRouteName,
} from 'features/navigation/ProfileStackNavigator/ProfileStack'

export const routes: ProfileStackRoute[] = [
  {
    name: 'Profile',
    component: ComponentForPathConfig,
    path: 'profil',
    options: { title: 'Mon profil' },
  },
]

export function isProfileStackScreen(screen: string): screen is ProfileStackRouteName {
  const profileStackRouteNames = routes.map((route): string => route.name)
  return profileStackRouteNames.includes(screen)
}
