import { navigationRef } from 'features/navigation/navigationRef'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'

export function navigateToHome() {
  navigationRef.current?.navigate(...homeNavConfig)
}
