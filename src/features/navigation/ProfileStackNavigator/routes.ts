import { ComponentForPathConfig } from 'features/navigation/ComponentForPathConfig'
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

export const profileStackRouteNames = routes.map((route): string => route.name)
