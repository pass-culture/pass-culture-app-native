import { createComponentForStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Achievements from 'features/achievements/pages/Achievements'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/navigators/RootNavigator/navigationOptions'
import { useIsSignedIn } from 'features/navigation/navigators/TabNavigator/TabStackNavigator'
import { Accessibility } from 'features/profile/pages/Accessibility/Accessibility'
import { AccessibilityDeclarationMobileAndroid } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobileAndroid'
import { AccessibilityDeclarationMobileIOS } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobileIOS'
import { AccessibilityDeclarationWeb } from 'features/profile/pages/Accessibility/AccessibilityDeclarationWeb'
import { RecommendedPaths } from 'features/profile/pages/Accessibility/RecommendedPaths'
import { SiteMapScreen } from 'features/profile/pages/Accessibility/SiteMapScreen'
import { ChangeAddress } from 'features/profile/pages/ChangeAddress/ChangeAddress'
import { ChangeCity } from 'features/profile/pages/ChangeCity/ChangeCity'
import { ChangeEmail } from 'features/profile/pages/ChangeEmail/ChangeEmail'
import { ChangeEmailSetPassword } from 'features/profile/pages/ChangeEmailSetPassword/ChangeEmailSetPassword'
import { ChangePassword } from 'features/profile/pages/ChangePassword'
import { ChangeStatus } from 'features/profile/pages/ChangeStatus/ChangeStatus'
import { Chatbot } from 'features/profile/pages/Chatbot/Chatbot'
import { ConfirmChangeEmail } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmail'
import { ConsentSettings } from 'features/profile/pages/ConsentSettings/ConsentSettings'
import { DebugScreen } from 'features/profile/pages/DebugScreen/DebugScreen'
import { ConfirmDeleteProfile } from 'features/profile/pages/DeleteProfile/ConfirmDeleteProfile'
import { DeactivateProfileSuccess } from 'features/profile/pages/DeleteProfile/DeactivateProfileSuccess'
import { DeleteProfileAccountHacked } from 'features/profile/pages/DeleteProfile/DeleteProfileAccountHacked'
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
import { TrackEmailChange } from 'features/profile/pages/TrackEmailChange/TrackEmailChange'
import { ProfileTutorialAgeInformationCredit } from 'features/profile/pages/TutorialAgeInformationCredit/ProfileTutorialAgeInformationCredit'
import { ValidateEmailChange } from 'features/profile/pages/ValidateEmailChange/ValidateEmailChange'

const profileStackNavigatorPathDefinition = {
  screenOptions: ROOT_NAVIGATOR_SCREEN_OPTIONS,
  screens: {
    Achievements: {
      screen: Achievements,
      linking: {
        path: 'trophees',
      },
      options: { title: 'Mes succès' },
    },
    Accessibility: {
      screen: Accessibility,
      linking: {
        path: 'accessibilite',
      },
    },
    AccessibilityDeclarationMobileAndroid: {
      screen: AccessibilityDeclarationMobileAndroid,
      linking: {
        path: 'accessibilite/declaration-accessibilite-mobile-android',
      },
    },
    AccessibilityDeclarationMobileIOS: {
      screen: AccessibilityDeclarationMobileIOS,
      linking: {
        path: 'accessibilite/declaration-accessibilite-mobile-ios',
      },
    },
    AccessibilityDeclarationWeb: {
      screen: AccessibilityDeclarationWeb,
      linking: {
        path: 'accessibilite/declaration-accessibilite-web',
      },
    },
    RecommendedPaths: {
      screen: RecommendedPaths,
      linking: {
        path: 'accessibilite/parcours-recommandes',
      },
    },
    SiteMapScreen: {
      screen: SiteMapScreen,
      linking: {
        path: 'accessibilite/plan-du-site',
      },
    },
    NotificationsSettings: {
      screen: NotificationsSettings,
      linking: {
        path: 'profil/notifications',
      },
    },
    Chatbot: {
      screen: Chatbot,
      linking: {
        path: 'profil/notifications',
      },
      options: { title: 'Chatbot' },
    },
    DeleteProfileReason: {
      screen: DeleteProfileReason,
      if: useIsSignedIn,
      linking: {
        path: 'profil/suppression/raison',
      },
    },
    DeleteProfileContactSupport: {
      screen: DeleteProfileContactSupport,
      if: useIsSignedIn,
      linking: {
        path: 'profil/suppression/support',
      },
    },
    DeleteProfileEmailHacked: {
      screen: DeleteProfileEmailHacked,
      if: useIsSignedIn,
      linking: {
        path: 'profil/suppression/email-pirate',
      },
    },
    DeleteProfileAccountHacked: {
      screen: DeleteProfileAccountHacked,
      if: useIsSignedIn,
      linking: {
        path: 'profil/suppression/compte-pirate',
      },
    },
    DeleteProfileAccountNotDeletable: {
      screen: DeleteProfileAccountNotDeletable,
      if: useIsSignedIn,
      linking: {
        path: 'profil/suppression/information',
      },
    },
    DebugScreen: {
      screen: DebugScreen,
      linking: {
        path: 'profil/debuggage',
      },
    },
    ConfirmDeleteProfile: {
      screen: ConfirmDeleteProfile,
      if: useIsSignedIn,
      linking: {
        path: 'profil/suppression',
      },
    },
    DeleteProfileConfirmation: {
      screen: DeleteProfileConfirmation,
      linking: {
        path: 'profile/suppression/confirmation',
      },
    },
    // FIXME(PC-00000): Why is it not in the routes
    DeleteProfileSuccess: {
      screen: DeleteProfileSuccess,
      if: useIsSignedIn,
      linking: {
        path: 'profile/suppression/succes',
      },
    },
    DeactivateProfileSuccess: {
      screen: DeactivateProfileSuccess,
      if: useIsSignedIn,
      linking: {
        path: 'profile/desactivation/succes',
      },
    },
    SuspendAccountConfirmationWithoutAuthentication: {
      screen: SuspendAccountConfirmationWithoutAuthentication,
      if: useIsSignedIn,
      linking: {
        path: 'profile/suppression/demande-confirmation',
      },
    },
    SuspendAccountConfirmation: {
      screen: SuspendAccountConfirmation,
      linking: {
        path: 'suspension-compte/confirmation',
      },
    },
    ChangeStatus: {
      screen: ChangeStatus,
      if: useIsSignedIn,
      linking: {
        path: 'profil/modification-statut',
      },
    },
    ChangeCity: {
      screen: ChangeCity,
      if: useIsSignedIn,
      linking: {
        path: 'profil/modification-ville',
      },
    },
    ChangeAddress: {
      screen: ChangeAddress,
      if: useIsSignedIn,
      linking: {
        path: 'profil/modification-adresse',
      },
    },
    ChangeEmail: {
      screen: ChangeEmail,
      linking: {
        path: 'profil/modification-email',
      },
    },
    TrackEmailChange: {
      screen: TrackEmailChange,
      if: useIsSignedIn,
      linking: {
        path: 'profil/suivi-modification-email',
      },
    },
    LegalNotices: {
      screen: LegalNotices,
      linking: {
        path: 'notices-legales',
      },
    },
    PersonalData: {
      screen: PersonalData,
      if: useIsSignedIn,
      linking: {
        path: 'profil/donnees-personnelles',
      },
    },
    ValidateEmailChange: {
      screen: ValidateEmailChange,
      linking: {
        path: 'changement-email/validation',
      },
    },
    ChangePassword: {
      screen: ChangePassword,
      linking: {
        path: 'profil/modification-mot-de-passe',
      },
    },
    FeedbackInApp: {
      screen: FeedbackInApp,
      if: useIsSignedIn,
      linking: {
        path: 'profil/formulaire-suggestion',
      },
    },
    // Appearance: {
    //   screen: Appearance,
    //   linking: {
    //     path: 'profil/preference-affichage',
    //   },
    // },
    ConsentSettings: {
      screen: ConsentSettings,
      linking: {
        path: 'profil/confidentialite',
      },
    },
    ConfirmChangeEmail: {
      screen: ConfirmChangeEmail,
      linking: {
        path: 'changement-email/confirmation',
      },
    },
    ChangeEmailSetPassword: {
      screen: ChangeEmailSetPassword,
      if: useIsSignedIn,
      linking: {
        path: 'profil/creation-mot-de-passe',
      },
    },
    NewEmailSelection: {
      screen: NewEmailSelection,
      if: useIsSignedIn,
      linking: {
        path: 'profil/nouvelle-adresse-email',
      },
    },
    ProfileTutorialAgeInformationCredit: {
      screen: ProfileTutorialAgeInformationCredit,
      linking: {
        path: 'profil/tutoriel',
      },
    },
    MandatoryUpdatePersonalData: {
      screen: MandatoryUpdatePersonalData,
      if: useIsSignedIn,
      linking: {
        path: 'profil/mise-a-jour-informations-personnelles',
      },
    },
    UpdatePersonalDataConfirmation: {
      screen: UpdatePersonalDataConfirmation,
      if: useIsSignedIn,
      linking: {
        path: 'profil/confirmation-mise-a-jour-informations-personnelles',
      },
    },
    ProfileInformationValidationUpdate: {
      screen: ProfileInformationValidationUpdate,
      if: useIsSignedIn,
      linking: {
        path: 'profil/verification-informations-personnelles',
      },
    },
  },
}

export const ProfileStackNavigator = createNativeStackNavigator(profileStackNavigatorPathDefinition)

const ProfileScreen = createComponentForStaticNavigation(ProfileStackNavigator, 'Profile')

export default ProfileScreen
