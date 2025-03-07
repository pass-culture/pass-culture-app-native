import { ComponentForPathConfig } from 'features/navigation/ComponentForPathConfig'
import { accessibilityRoutes } from 'features/navigation/ProfileStackNavigator/accessibilityRoutes'
import {
  ProfileStackRoute,
  ProfileStackRouteName,
} from 'features/navigation/ProfileStackNavigator/ProfileStack'

export const routes: ProfileStackRoute[] = [
  ...accessibilityRoutes,
  {
    name: 'Profile',
    component: ComponentForPathConfig,
    path: 'profil',
    options: { title: 'Mon profil' },
  },
  {
    name: 'NotificationsSettings',
    component: ComponentForPathConfig,
    path: 'profil/notifications',
    options: { title: 'Réglages de notifications' },
  },
]

export function isProfileStackScreen(screen: string): screen is ProfileStackRouteName {
  const profileStackRouteNames = routes.map((route): string => route.name)
  return profileStackRouteNames.includes(screen)
}
