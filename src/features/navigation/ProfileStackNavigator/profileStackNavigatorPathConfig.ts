import { Accessibility } from 'features/profile/pages/Accessibility/Accessibility'
import { AccessibilityActionPlan } from 'features/profile/pages/Accessibility/AccessibilityActionPlan'
import { AccessibilityDeclarationMobileAndroid } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobileAndroid'
import { AccessibilityDeclarationMobileIOS } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobileIOS'
import { AccessibilityDeclarationWeb } from 'features/profile/pages/Accessibility/AccessibilityDeclarationWeb'
import { AccessibilityEngagement } from 'features/profile/pages/Accessibility/AccessibilityEngagement'
import { RecommendedPaths } from 'features/profile/pages/Accessibility/RecommendedPaths'
import { SiteMapScreen } from 'features/profile/pages/Accessibility/SiteMapScreen'
import { ChangeAddress } from 'features/profile/pages/ChangeAddress/ChangeAddress'
import { ChangeCity } from 'features/profile/pages/ChangeCity/ChangeCity'
import { ChangeEmail } from 'features/profile/pages/ChangeEmail/ChangeEmail'
import { ChangeEmailSetPassword } from 'features/profile/pages/ChangeEmailSetPassword/ChangeEmailSetPassword'
import { ChangePassword } from 'features/profile/pages/ChangePassword'
import { ChangeStatus } from 'features/profile/pages/ChangeStatus/ChangeStatus'
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
import { DisplayPreference } from 'features/profile/pages/DisplayPreference/DisplayPreference'
import { FeedbackInApp } from 'features/profile/pages/FeedbackInApp/FeedbackInApp'
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
import { LegalNotices } from 'ui/svg/icons/LegalNotices'

export const profileStackNavigatorPathConfig = {
  screens: {
    Accessibility: {
      screen: Accessibility,
      linking: {
        path: 'accessibilite',
      },
    },
    AccessibilityEngagement: {
      screen: AccessibilityEngagement,
      linking: {
        path: 'accessibilite/engagements',
      },
    },
    AccessibilityActionPlan: {
      screen: AccessibilityActionPlan,
      linking: {
        path: 'accessibilite/plan-d-actions',
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
    DeleteProfileReason: {
      screen: DeleteProfileReason,
      linking: {
        path: 'profil/suppression/raison',
      },
    },
    DeleteProfileContactSupport: {
      screen: DeleteProfileContactSupport,
      linking: {
        path: 'profil/suppression/support',
      },
    },
    DeleteProfileEmailHacked: {
      screen: DeleteProfileEmailHacked,
      linking: {
        path: 'profil/suppression/email-pirate',
      },
    },
    DeleteProfileAccountHacked: {
      screen: DeleteProfileAccountHacked,
      linking: {
        path: 'profil/suppression/compte-pirate',
      },
    },
    DeleteProfileAccountNotDeletable: {
      screen: DeleteProfileAccountNotDeletable,
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
    DeleteProfileSuccess: {
      screen: DeleteProfileSuccess,
      linking: {
        path: 'profile/suppression/succes',
      },
    },
    DeactivateProfileSuccess: {
      screen: DeactivateProfileSuccess,
      linking: {
        path: 'profile/desactivation/succes',
      },
    },
    SuspendAccountConfirmationWithoutAuthentication: {
      screen: SuspendAccountConfirmationWithoutAuthentication,
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
      linking: {
        path: 'profil/modification-statut',
      },
    },
    ChangeCity: {
      screen: ChangeCity,
      linking: {
        path: 'profil/modification-ville',
      },
    },
    ChangeAddress: {
      screen: ChangeAddress,
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
      linking: {
        path: 'profil/formulaire-suggestion',
      },
    },
    DisplayPreference: {
      screen: DisplayPreference,
      linking: {
        path: 'profil/preference-affichage',
      },
    },
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
      linking: {
        path: 'profil/creation-mot-de-passe',
      },
    },
    NewEmailSelection: {
      screen: NewEmailSelection,
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
      linking: {
        path: 'profil/mise-a-jour-informations-personnelles',
      },
    },
    UpdatePersonalDataConfirmation: {
      screen: UpdatePersonalDataConfirmation,
      linking: {
        path: 'profil/confirmation-mise-a-jour-informations-personnelles',
      },
    },
    ProfileInformationValidationUpdate: {
      screen: ProfileInformationValidationUpdate,
      linking: {
        path: 'profil/verification-informations-personnelles',
      },
    },
  },
}
