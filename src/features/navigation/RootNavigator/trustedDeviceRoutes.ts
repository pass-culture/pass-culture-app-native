import { NavigationTrustedDevice } from 'features/internal/cheatcodes/pages/NavigationTrustedDevice/NavigationTrustedDevice'
import { TrustedDeviceInfos } from 'features/internal/cheatcodes/pages/NavigationTrustedDevice/TrustedDeviceInfos'
import {
  TrustedDeviceRootStackParamList,
  GenericRoute,
} from 'features/navigation/RootNavigator/types'
import { AccountSecurity } from 'features/trustedDevice/pages/AccountSecurity'
import { SuspensionChoice } from 'features/trustedDevice/pages/SuspensionChoice'
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
    name: 'SuspensionChoice',
    component: SuspensionChoice,
    path: 'securisation-compte/suspension',
  },
  {
    name: 'SuspensionConfirmation',
    component: SuspensionConfirmation,
    path: 'securisation-compte/suspension-confirmee',
  },
  {
    name: 'AccountSecurity',
    component: AccountSecurity,
    path: 'securisation-compte',
  },
]
