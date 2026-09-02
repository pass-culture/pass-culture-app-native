import { createComponentForStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Achievements from 'features/achievements/pages/Achievements'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/navigators/RootNavigator/navigationOptions'
import { useIsSignedIn } from 'features/navigation/navigators/TabNavigator/TabStackNavigator'
import { Accessibility } from 'features/profile/pages/Accessibility/Accessibility'
import { AccessibilityDeclarationMobileAndroid } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobileAndroid'
import { AccessibilityDeclarationMobileIOS } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobileIOS'
import { AccessibilityDeclarationWeb } from 'features/profile/pages/Accessibility/AccessibilityDeclarationWeb'
import { PublicDisabilityServices } from 'features/profile/pages/Accessibility/PublicDisabilityServices'
import { SiteMapScreen } from 'features/profile/pages/Accessibility/SiteMapScreen'
import { Appearance } from 'features/profile/pages/Appearance/Appearance'
import { ChangeAddress } from 'features/profile/pages/ChangeAddress/ChangeAddress'
import { ChangeCity } from 'features/profile/pages/ChangeCity/ChangeCity'
import { ChangeEmail } from 'features/profile/pages/ChangeEmail/ChangeEmail'
import { ChangeEmailSetPassword } from 'features/profile/pages/ChangeEmailSetPassword/ChangeEmailSetPassword'
import { ChangePassword } from 'features/profile/pages/ChangePassword'
import { ChangePhoneNumber } from 'features/profile/pages/ChangePhoneNumber/ChangePhoneNumber'
import { ChangeStatus } from 'features/profile/pages/ChangeStatus/ChangeStatus'
import { Chatbot } from 'features/profile/pages/Chatbot/Chatbot'
import { ConfirmChangeEmail } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmail'
import { ConsentSettings } from 'features/profile/pages/ConsentSettings/ConsentSettings'
import { DebugScreen } from 'features/profile/pages/DebugScreen/DebugScreen'
import { ConfirmDeleteProfile } from 'features/profile/pages/DeleteProfile/ConfirmDeleteProfile'
import { DeactivateProfileSuccess } from 'features/profile/pages/DeleteProfile/DeactivateProfileSuccess'
import { DeleteProfileAccountNotDeletable } from 'features/profile/pages/DeleteProfile/DeleteProfileAccountNotDeletable'
import { DeleteProfileConfirmation } from 'features/profile/pages/DeleteProfile/DeleteProfileConfirmation'
import { DeleteProfileContactSupport } from 'features/profile/pages/DeleteProfile/DeleteProfileContactSupport'
import { DeleteProfileEmailHacked } from 'features/profile/pages/DeleteProfile/DeleteProfileEmailHacked'
import { DeleteProfileSuccess } from 'features/profile/pages/DeleteProfile/DeleteProfileSuccess'
import { SuspendAccountConfirmationWithoutAuthentication } from 'features/profile/pages/DeleteProfile/SuspendAccountConfirmationWithoutAuthentication'
import { DeleteProfileReason } from 'features/profile/pages/DeleteProfileReason/DeleteProfileReason'
import { FeedbackInApp } from 'features/profile/pages/FeedbackInApp/FeedbackInApp'
import { LegalNotices } from 'features/profile/pages/LegalNotices/LegalNotices'
import { MandatoryUpdatePersonalData } from 'features/profile/pages/MandatoryUpdatePersonalData/MandatoryUpdatePersonalData'
import { ProfileInformationValidationUpdate } from 'features/profile/pages/MandatoryUpdatePersonalData/ProfileInformationValidationUpdate'
import { UpdatePersonalDataConfirmation } from 'features/profile/pages/MandatoryUpdatePersonalData/UpdatePersonalDataConfirmation'
import { NewEmailSelection } from 'features/profile/pages/NewEmailSelection/NewEmailSelection'
import { NotificationsSettings } from 'features/profile/pages/NotificationSettings/NotificationsSettings'
import { PersonalData } from 'features/profile/pages/PersonalData/PersonalData'
import { SuspendAccountConfirmation } from 'features/profile/pages/SuspendAccountConfirmation/SuspendAccountConfirmation'
import { SuspendProfileAccountHacked } from 'features/profile/pages/SuspendProfile/SuspendProfileAccountHacked'
import { SuspendProfileReason } from 'features/profile/pages/SuspendProfileReason/SuspendProfileReason'
import { TrackEmailChange } from 'features/profile/pages/TrackEmailChange/TrackEmailChange'
import { ProfileTutorialAgeInformationCredit } from 'features/profile/pages/TutorialAgeInformationCredit/ProfileTutorialAgeInformationCredit'
import { ValidateEmailChange } from 'features/profile/pages/ValidateEmailChange/ValidateEmailChange'

const profileStackNavigatorPathDefinition = {
  screenOptions: ROOT_NAVIGATOR_SCREEN_OPTIONS,
  screens: {
    Achievements: {
      screen: Achievements,
      linking: { path: 'trophees' },
      options: { title: 'Mes succès' },
    },
    Accessibility: {
      screen: Accessibility,
      linking: { path: 'accessibilite' },
      options: { title: 'Accessibilité' },
    },
    AccessibilityDeclarationMobileAndroid: {
      screen: AccessibilityDeclarationMobileAndroid,
      linking: { path: 'accessibilite/declaration-accessibilite-mobile-android' },
      options: { title: 'Déclaration d’accessibilité Android' },
    },
    AccessibilityDeclarationMobileIOS: {
      screen: AccessibilityDeclarationMobileIOS,
      linking: { path: 'accessibilite/declaration-accessibilite-mobile-ios' },
      options: { title: 'Déclaration d’accessibilité iOS' },
    },
    AccessibilityDeclarationWeb: {
      screen: AccessibilityDeclarationWeb,
      linking: { path: 'accessibilite/declaration-accessibilite-web' },
      options: { title: 'Déclaration d’accessibilité Web' },
    },
    SiteMapScreen: {
      screen: SiteMapScreen,
      linking: { path: 'accessibilite/plan-du-site' },
      options: { title: 'Plan du site' },
    },
    NotificationsSettings: {
      screen: NotificationsSettings,
      linking: { path: 'profil/notifications' },
      options: { title: 'Notifications' },
    },
    Chatbot: {
      screen: Chatbot,
      linking: { path: 'profil/chatbot' },
      options: { title: 'Chatbot' },
    },
    DeleteProfileReason: {
      screen: DeleteProfileReason,
      if: useIsSignedIn,
      linking: { path: 'profil/suppression/raison' },
      options: { title: 'Suppression du profil - Raison' },
    },
    DeleteProfileContactSupport: {
      screen: DeleteProfileContactSupport,
      if: useIsSignedIn,
      linking: { path: 'profil/suppression/support' },
      options: { title: 'Suppression du profil - Support' },
    },
    DeleteProfileEmailHacked: {
      screen: DeleteProfileEmailHacked,
      if: useIsSignedIn,
      linking: { path: 'profil/suppression/email-pirate' },
      options: { title: 'Suppression du profil - Email piraté' },
    },
    SuspendProfileAccountHacked: {
      screen: SuspendProfileAccountHacked,
      if: useIsSignedIn,
      linking: { path: 'profil/suspension/compte-pirate' },
      options: { title: 'Suspension du profil - Compte piraté' },
    },
    DeleteProfileAccountNotDeletable: {
      screen: DeleteProfileAccountNotDeletable,
      if: useIsSignedIn,
      linking: { path: 'profil/suppression/information' },
      options: { title: 'Suppression du profil - Information' },
    },
    DebugScreen: {
      screen: DebugScreen,
      linking: { path: 'profil/debuggage' },
      options: { title: 'Debuggage' },
    },
    SuspendProfileReason: {
      screen: SuspendProfileReason,
      if: useIsSignedIn,
      linking: { path: 'profil/suspension/raison' },
      options: { title: 'Suspension du profil - Raison' },
    },
    ConfirmDeleteProfile: {
      screen: ConfirmDeleteProfile,
      if: useIsSignedIn,
      linking: { path: 'profil/suppression' },
      options: { title: 'Suppression du profil' },
    },
    DeleteProfileConfirmation: {
      screen: DeleteProfileConfirmation,
      linking: { path: 'profil/suppression/confirmation' },
      options: { title: 'Suppression du profil - Confirmation' },
    },
    // FIXME(PC-00000): Why is it not in the routes
    DeleteProfileSuccess: {
      screen: DeleteProfileSuccess,
      linking: { path: 'profil/suppression/succes' },
      options: { title: 'Suppression du profil - Succès' },
    },
    DeactivateProfileSuccess: {
      screen: DeactivateProfileSuccess,
      linking: { path: 'profil/desactivation/succes' },
      options: { title: 'Désactivation du profil - Succès' },
    },
    SuspendAccountConfirmationWithoutAuthentication: {
      screen: SuspendAccountConfirmationWithoutAuthentication,
      if: useIsSignedIn,
      linking: { path: 'profil/suppression/demande-confirmation' },
      options: { title: 'Suppression du profil - Demande de confirmation' },
    },
    SuspendAccountConfirmation: {
      screen: SuspendAccountConfirmation,
      linking: { path: 'profil/suspension-compte/confirmation' },
      options: { title: 'Suspension du profil - Confirmation' },
    },
    ChangeStatus: {
      screen: ChangeStatus,
      if: useIsSignedIn,
      linking: { path: 'profil/modification-statut' },
      options: { title: 'Modification du profil - Statut' },
    },
    ChangePhoneNumber: {
      screen: ChangePhoneNumber,
      if: useIsSignedIn,
      linking: { path: 'profil/modification-telephone' },
      options: { title: 'Modification du profil - Téléphone' },
    },
    ChangeCity: {
      screen: ChangeCity,
      if: useIsSignedIn,
      linking: { path: 'profil/modification-ville' },
      options: { title: 'Modification du profil - Ville' },
    },
    ChangeAddress: {
      screen: ChangeAddress,
      if: useIsSignedIn,
      linking: { path: 'profil/modification-adresse' },
      options: { title: 'Modification du profil - Adresse' },
    },
    ChangeEmail: {
      screen: ChangeEmail,
      linking: { path: 'profil/modification-email' },
      options: { title: 'Modification du profil - Email' },
    },
    TrackEmailChange: {
      screen: TrackEmailChange,
      if: useIsSignedIn,
      linking: { path: 'profil/suivi-modification-email' },
      options: { title: 'Suivi de la modification de l’email' },
    },
    LegalNotices: {
      screen: LegalNotices,
      linking: { path: 'notices-legales' },
      options: { title: 'Mentions légales' },
    },
    PersonalData: {
      screen: PersonalData,
      if: useIsSignedIn,
      linking: { path: 'profil/donnees-personnelles' },
      options: { title: 'Données personnelles' },
    },
    PublicDisabilityServices: {
      screen: PublicDisabilityServices,
      linking: { path: 'profil/outils-services-publics' },
      options: { title: 'Outils et services publics' },
    },
    ValidateEmailChange: {
      screen: ValidateEmailChange,
      linking: { path: 'changement-email/validation' },
      options: { title: 'Validation du changement d’email' },
    },
    ChangePassword: {
      screen: ChangePassword,
      linking: { path: 'profil/modification-mot-de-passe' },
      options: { title: 'Modification du profil - Mot de passe' },
    },
    FeedbackInApp: {
      screen: FeedbackInApp,
      if: useIsSignedIn,
      linking: { path: 'profil/formulaire-suggestion' },
      options: { title: 'Formulaire de suggestion' },
    },
    Appearance: {
      screen: Appearance,
      linking: { path: 'profil/preference-affichage' },
      options: { title: 'Préférence d’affichage' },
    },
    ConsentSettings: {
      screen: ConsentSettings,
      linking: { path: 'profil/confidentialite' },
      options: { title: 'Confidentialité' },
    },
    ConfirmChangeEmail: {
      screen: ConfirmChangeEmail,
      linking: { path: 'changement-email/confirmation' },
      options: { title: 'Confirmation du changement d’email' },
    },
    ChangeEmailSetPassword: {
      screen: ChangeEmailSetPassword,
      if: useIsSignedIn,
      linking: { path: 'profil/creation-mot-de-passe' },
      options: { title: 'Création du mot de passe' },
    },
    NewEmailSelection: {
      screen: NewEmailSelection,
      if: useIsSignedIn,
      linking: { path: 'profil/nouvelle-adresse-email' },
      options: { title: 'Nouvelle adresse email' },
    },
    ProfileTutorialAgeInformationCredit: {
      screen: ProfileTutorialAgeInformationCredit,
      linking: { path: 'profil/tutoriel' },
      options: { title: 'Tutoriel' },
    },
    MandatoryUpdatePersonalData: {
      screen: MandatoryUpdatePersonalData,
      if: useIsSignedIn,
      linking: { path: 'profil/mise-a-jour-informations-personnelles' },
      options: { title: 'Mise à jour des informations personnelles' },
    },
    UpdatePersonalDataConfirmation: {
      screen: UpdatePersonalDataConfirmation,
      if: useIsSignedIn,
      linking: { path: 'profil/confirmation-mise-a-jour-informations-personnelles' },
      options: { title: 'Confirmation mise à jour des informations personnelles' },
    },
    ProfileInformationValidationUpdate: {
      screen: ProfileInformationValidationUpdate,
      if: useIsSignedIn,
      linking: { path: 'profil/verification-informations-personnelles' },
      options: { title: 'Vérification des informations personnelles' },
    },
  },
}

export const AUTH_PROTECTED_PROFILE_SCREENS = new Set(
  Object.entries(profileStackNavigatorPathDefinition.screens).flatMap(
    ([screenName, screenDefinition]) =>
      'if' in screenDefinition && screenDefinition.if === useIsSignedIn ? [screenName] : []
  )
)

export const ProfileStackNavigator = createNativeStackNavigator(profileStackNavigatorPathDefinition)

const ProfileScreen = createComponentForStaticNavigation(ProfileStackNavigator)

export default ProfileScreen
