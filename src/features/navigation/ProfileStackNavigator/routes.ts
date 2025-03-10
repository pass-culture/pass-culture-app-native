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
    options: { title: 'Mon profil' },
  },
  {
    name: 'NotificationsSettings',
    component: ComponentForPathConfig,
    path: 'profil/notifications',
    options: { title: 'Réglages de notifications' },
  },
  {
    name: 'DeleteProfileReason',
    component: ComponentForPathConfig,
    path: 'profil/suppression/raison',
    options: { title: 'Raison de suppression de compte' },
    secure: true,
  },
  {
    name: 'DeleteProfileContactSupport',
    component: ComponentForPathConfig,
    path: 'profil/suppression/support',
    options: { title: 'Contact support' },
    secure: true,
  },
  {
    name: 'DeleteProfileEmailHacked',
    component: ComponentForPathConfig,
    path: 'profil/suppression/email-pirate',
    options: { title: 'Sécurise ton compte' },
    secure: true,
  },
  {
    name: 'DeleteProfileAccountHacked',
    component: ComponentForPathConfig,
    path: 'profil/suppression/compte-pirate',
    options: { title: 'Sécurise ton compte' },
    secure: true,
  },
  {
    name: 'DeleteProfileAccountNotDeletable',
    component: ComponentForPathConfig,
    path: 'profil/suppression/information',
    options: { title: 'Compte non supprimable' },
    secure: true,
  },
  {
    name: 'ConfirmDeleteProfile',
    component: ComponentForPathConfig,
    path: 'profil/suppression',
    options: { title: 'Suppression de compte' },
    secure: true,
  },
  {
    name: 'DeleteProfileConfirmation',
    component: ComponentForPathConfig,
    path: 'profile/suppression/confirmation',
    options: { title: 'Suppression profil confirmation' },
  },
  {
    name: 'DeleteProfileSuccess',
    component: ComponentForPathConfig,
    path: 'profile/suppression/succes',
    options: { title: 'Suppression profil confirmée' },
  },
]

export function isProfileStackScreen(screen: string): screen is ProfileStackRouteName {
  const profileStackRouteNames = routes.map((route): string => route.name)
  return profileStackRouteNames.includes(screen)
}
