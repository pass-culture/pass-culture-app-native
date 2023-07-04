import { NavigationTrustedDevice } from 'features/internal/cheatcodes/pages/NavigationTrustedDevice/NavigationTrustedDevice'
import { TrustedDeviceInfos } from 'features/internal/cheatcodes/pages/NavigationTrustedDevice/TrustedDeviceInfos'
import {
  TrustedDeviceRootStackParamList,
  GenericRoute,
} from 'features/navigation/RootNavigator/types'
import { screenParamsParser } from 'features/navigation/screenParamsUtils'
import { AccountSecurity } from 'features/trustedDevice/pages/AccountSecurity'
import { AccountSecurityBuffer } from 'features/trustedDevice/pages/AccountSecurityBuffer'
import { SuspensionChoice } from 'features/trustedDevice/pages/SuspensionChoice'
import { SuspensionChoiceExpiredLink } from 'features/trustedDevice/pages/SuspensionChoiceExpiredLink'
import { SuspensionConfirmation } from 'features/trustedDevice/pages/SuspensionConfirmation'

// Try to keep those routes in the same order as the user flow
export const trustedDeviceRoutes: GenericRoute<TrustedDeviceRootStackParamList>[] = [
  {
    name: 'AccountSecurityBuffer',
    // @ts-ignore Buffer return components or navigation to Home
    component: AccountSecurityBuffer,
    path: 'securisation-compte',
  },
  {
    name: 'AccountSecurity',
    component: AccountSecurity,
    pathConfig: {
      path: 'securisation-compte/choix',
      parse: screenParamsParser['ReinitializePassword'],
    },
  },
  {
    name: 'SuspensionChoice',
    component: SuspensionChoice,
    path: 'securisation-compte/suspension',
  },
  {
    name: 'SuspensionChoiceExpiredLink',
    component: SuspensionChoiceExpiredLink,
    path: 'securisation-compte/lien-suspension-compte-expire',
    options: { title: 'Lien de suspension de compte expiré' },
  },
  {
    name: 'SuspensionConfirmation',
    component: SuspensionConfirmation,
    path: 'securisation-compte/suspension-confirmee',
  },
  // Cheatcode
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
]
