import { ComponentForPathConfig } from 'features/navigation/ComponentForPathConfig'
import { accessibilityRoutes } from 'features/navigation/ProfileStackNavigator/accessibilityRoutes'
import {
  ProfileStackRoute,
  ProfileStackRouteName,
} from 'features/navigation/ProfileStackNavigator/ProfileStack'

export const routes: ProfileStackRoute[] = [
  ...accessibilityRoutes,
  {
    name: 'Profile',
    component: ComponentForPathConfig,
    path: 'profil',
  },
  {
    name: 'NotificationsSettings',
    component: ComponentForPathConfig,
    path: 'profil/notifications',
  },
  {
    name: 'DeleteProfileReason',
    component: ComponentForPathConfig,
    path: 'profil/suppression/raison',
  },
  {
    name: 'DeleteProfileContactSupport',
    component: ComponentForPathConfig,
    path: 'profil/suppression/support',
  },
  {
    name: 'DeleteProfileEmailHacked',
    component: ComponentForPathConfig,
    path: 'profil/suppression/email-pirate',
  },
  {
    name: 'DeleteProfileAccountHacked',
    component: ComponentForPathConfig,
    path: 'profil/suppression/compte-pirate',
  },
  {
    name: 'DeleteProfileAccountNotDeletable',
    component: ComponentForPathConfig,
    path: 'profil/suppression/information',
  },
  {
    name: 'ConfirmDeleteProfile',
    component: ComponentForPathConfig,
    path: 'profil/suppression',
  },
  {
    name: 'DeleteProfileConfirmation',
    component: ComponentForPathConfig,
    path: 'profile/suppression/confirmation',
  },
  {
    name: 'DeleteProfileSuccess',
    component: ComponentForPathConfig,
    path: 'profile/suppression/succes',
  },
  {
    name: 'DeactivateProfileSuccess',
    component: ComponentForPathConfig,
    path: 'profile/desactivation/succes',
  },
  {
    name: 'SuspendAccountConfirmationWithoutAuthentication',
    component: ComponentForPathConfig,
    path: 'profile/suppression/demande-confirmation',
  },
  {
    name: 'ChangeStatus',
    component: ComponentForPathConfig,
    path: 'profil/modification-statut',
  },
  {
    name: 'ChangeCity',
    component: ComponentForPathConfig,
    path: 'profil/modification-ville',
  },
  {
    name: 'ChangeEmail',
    component: ComponentForPathConfig,
    path: 'profil/modification-email',
  },
  {
    name: 'TrackEmailChange',
    component: ComponentForPathConfig,
    path: 'profil/suivi-modification-email',
  },
]

export function isProfileStackScreen(screen: string): screen is ProfileStackRouteName {
  const profileStackRouteNames = routes.map((route): string => route.name)
  return profileStackRouteNames.includes(screen)
}
