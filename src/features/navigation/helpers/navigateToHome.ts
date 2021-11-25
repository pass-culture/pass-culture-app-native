import { navigateFromRef } from 'features/navigation/navigationRef'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'

export function navigateToHome() {
  navigateFromRef(...homeNavConfig)
}
