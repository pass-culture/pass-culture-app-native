import { NavigationTrustedDevice } from 'features/internal/cheatcodes/pages/NavigationTrustedDevice/NavigationTrustedDevice'
import { TrustedDeviceInfos } from 'features/internal/cheatcodes/pages/NavigationTrustedDevice/TrustedDeviceInfos'
import {
  TrustedDeviceRootStackParamList,
  GenericRoute,
} from 'features/navigation/RootNavigator/types'
import { SuspensionConfirmation } from 'features/trustedDevice/pages/SuspensionConfirmation'

// Try to keep those routes in the same order as the user flow
export const trustedDeviceRoutes: GenericRoute<TrustedDeviceRootStackParamList>[] = [
  {
    name: 'NavigationTrustedDevice',
    component: NavigationTrustedDevice,
    path: 'appareil-de-confiance-navigation',
  },
  {
    name: 'TrustedDeviceInfos',
    component: TrustedDeviceInfos,
    path: 'appareil-de-confiance-cheatcode-informations',
  },
  {
    name: 'SuspensionConfirmation',
    component: SuspensionConfirmation,
    path: 'securisation-compte/suspension-confirmee',
  },
]
