import { ComponentForPathConfig } from 'features/navigation/ComponentForPathConfig'
import { ProfileStackRouteName } from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { GenericRoute } from 'features/navigation/RootNavigator/types'

type ProfileStackParamList = {
  Profile: undefined
}

type ProfileStackRoute = GenericRoute<ProfileStackParamList>

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
