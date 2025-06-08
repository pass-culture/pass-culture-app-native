import { temporaryRootStackConfig } from 'features/navigation/RootNavigator/linking/temporaryRootStackConfig'

import { RootScreenNames } from './types'

export function isRootStackScreen(screen): screen is RootScreenNames {
  const rootScreens = Object.keys(temporaryRootStackConfig)
  return rootScreens.includes(screen)
}
