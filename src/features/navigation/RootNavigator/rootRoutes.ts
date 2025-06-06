import { ThematicHome } from 'features/home/pages/ThematicHome'
import { DeeplinksGenerator } from 'features/internal/pages/DeeplinksGenerator'
import { UTMParameters } from 'features/internal/pages/UTMParameters'
import { culturalSurveyRoutes } from 'features/navigation/RootNavigator/culturalSurveyRoutes'
import { temporaryRootStackConfig } from 'features/navigation/RootNavigator/linking/temporaryRootStackConfig'
import { subscriptionRoutes } from 'features/navigation/RootNavigator/subscriptionRoutes'
import { trustedDeviceRoutes } from 'features/navigation/RootNavigator/trustedDeviceRoutes'
import { screenParamsParser } from 'features/navigation/screenParamsUtils'
import { tabNavigatorPathConfig } from 'features/navigation/TabBar/tabBarRoutes'
import { TabNavigator } from 'features/navigation/TabBar/TabNavigator'

import { RootRoute, RootScreenNames } from './types'

export const rootRoutes: RootRoute[] = [
  ...culturalSurveyRoutes,
  ...subscriptionRoutes,
  ...trustedDeviceRoutes,
  { name: 'TabNavigator', component: TabNavigator, pathConfig: tabNavigatorPathConfig },
  {
    name: 'DeeplinksGenerator',
    component: DeeplinksGenerator,
    pathConfig: {
      path: 'liens/generateur',
    },
    options: { title: 'Générateur de lien' },
  },
  {
    name: 'UTMParameters',
    component: UTMParameters,
    pathConfig: {
      path: 'liens/utm',
    },
    options: { title: 'Paramètres UTM' },
  },
  {
    name: 'ThematicHome',
    component: ThematicHome,
    pathConfig: {
      path: 'accueil-thematique',
      deeplinkPaths: ['thematic-home'],
      parse: screenParamsParser['ThematicHome'],
    },
    options: { title: 'Page d’accueil thématique' },
  },
]

export function isRootStackScreen(screen: string): screen is RootScreenNames {
  const screensRemovedFromRootRoutes = Object.keys(temporaryRootStackConfig)
  const rootStackRouteNames = rootRoutes.map((route): string => route.name)
  return [...rootStackRouteNames, ...screensRemovedFromRootRoutes].includes(screen)
}
