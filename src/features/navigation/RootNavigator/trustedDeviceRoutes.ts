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
import { SuspiciousLoginSuspendedAccount } from 'features/trustedDevice/pages/SuspiciousLoginSuspendedAccount'

// Try to keep those routes in the same order as the user flow
export const trustedDeviceRoutes: GenericRoute<TrustedDeviceRootStackParamList>[] = [
  {
    name: 'AccountSecurityBuffer',
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
    options: { title: 'Demande de sécurisation de compte' },
  },
  {
    name: 'SuspensionChoice',
    component: SuspensionChoice,
    path: 'securisation-compte/suspension',
    options: { title: 'Demande de suspension de compte' },
  },
  {
    name: 'SuspensionChoiceExpiredLink',
    component: SuspensionChoiceExpiredLink,
    path: 'securisation-compte/lien-suspension-compte-expire',
    options: { title: 'Lien de suspension de compte expiré' },
  },
  {
    name: 'SuspiciousLoginSuspendedAccount',
    component: SuspiciousLoginSuspendedAccount,
    path: 'securisation-compte/suspension-confirmee',
    options: { title: 'Confirmation de suspension de compte' },
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
    options: { title: 'Informations de l’appareil' },
  },
]
