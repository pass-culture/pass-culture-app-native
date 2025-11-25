import { PathConfigMap } from '@react-navigation/native/lib/typescript/src'

import { ProfileStackParamList } from 'features/navigation/ProfileStackNavigator/types'

export const profileStackNavigatorPathConfig: PathConfigMap<ProfileStackParamList> = {
  screens: {
    Accessibility: {
      screen: 'Accessibility',
      linking: {
        path: 'accessibilite',
      },
    },
    AccessibilityEngagement: {
      screen: 'AccessibilityEngagement',
      linking: {
        path: 'accessibilite/engagements',
      },
    },
    AccessibilityActionPlan: {
      screen: 'AccessibilityActionPlan',
      linking: {
        path: 'accessibilite/plan-d-actions',
      },
    },
    AccessibilityDeclarationMobileAndroid: {
      screen: 'AccessibilityDeclarationMobileAndroid',
      linking: {
        path: 'accessibilite/declaration-accessibilite-mobile-android',
      },
    },
    AccessibilityDeclarationMobileIOS: {
      screen: 'AccessibilityDeclarationMobileIOS',
      linking: {
        path: 'accessibilite/declaration-accessibilite-mobile-ios',
      },
    },
    AccessibilityDeclarationWeb: {
      screen: 'AccessibilityDeclarationWeb',
      linking: {
        path: 'accessibilite/declaration-accessibilite-web',
      },
    },
    RecommendedPaths: {
      screen: 'RecommendedPaths',
      linking: {
        path: 'accessibilite/parcours-recommandes',
      },
    },
    SiteMapScreen: {
      screen: 'SiteMapScreen',
      linking: {
        path: 'accessibilite/plan-du-site',
      },
    },
    NotificationsSettings: {
      screen: 'NotificationsSettings',
      linking: {
        path: 'profil/notifications',
      },
    },
    DeleteProfileReason: {
      screen: 'DeleteProfileReason',
      linking: {
        path: 'profil/suppression/raison',
      },
    },
    DeleteProfileContactSupport: {
      screen: 'DeleteProfileContactSupport',
      linking: {
        path: 'profil/suppression/support',
      },
    },
    DeleteProfileEmailHacked: {
      screen: 'DeleteProfileEmailHacked',
      linking: {
        path: 'profil/suppression/email-pirate',
      },
    },
    DeleteProfileAccountHacked: {
      screen: 'DeleteProfileAccountHacked',
      linking: {
        path: 'profil/suppression/compte-pirate',
      },
    },
    DeleteProfileAccountNotDeletable: {
      screen: 'DeleteProfileAccountNotDeletable',
      linking: {
        path: 'profil/suppression/information',
      },
    },
    DebugScreen: {
      screen: 'DebugScreen',
      linking: {
        path: 'profil/debuggage',
      },
    },
    ConfirmDeleteProfile: {
      screen: 'ConfirmDeleteProfile',
      linking: {
        path: 'profil/suppression',
      },
    },
    DeleteProfileConfirmation: {
      screen: 'DeleteProfileConfirmation',
      linking: {
        path: 'profile/suppression/confirmation',
      },
    },
    DeleteProfileSuccess: {
      screen: 'DeleteProfileSuccess',
      linking: {
        path: 'profile/suppression/succes',
      },
    },
    DeactivateProfileSuccess: {
      screen: 'DeactivateProfileSuccess',
      linking: {
        path: 'profile/desactivation/succes',
      },
    },
    SuspendAccountConfirmationWithoutAuthentication: {
      screen: 'SuspendAccountConfirmationWithoutAuthentication',
      linking: {
        path: 'profile/suppression/demande-confirmation',
      },
    },
    SuspendAccountConfirmation: {
      screen: 'SuspendAccountConfirmation',
      linking: {
        path: 'suspension-compte/confirmation',
      },
    },
    ChangeStatus: {
      screen: 'ChangeStatus',
      linking: {
        path: 'profil/modification-statut',
      },
    },
    ChangeCity: {
      screen: 'ChangeCity',
      linking: {
        path: 'profil/modification-ville',
      },
    },
    ChangeAddress: {
      screen: 'ChangeAddress',
      linking: {
        path: 'profil/modification-adresse',
      },
    },
    ChangeEmail: {
      screen: 'ChangeEmail',
      linking: {
        path: 'profil/modification-email',
      },
    },
    TrackEmailChange: {
      screen: 'TrackEmailChange',
      linking: {
        path: 'profil/suivi-modification-email',
      },
    },
    LegalNotices: {
      screen: 'LegalNotices',
      linking: {
        path: 'notices-legales',
      },
    },
    PersonalData: {
      screen: 'PersonalData',
      linking: {
        path: 'profil/donnees-personnelles',
      },
    },
    ValidateEmailChange: {
      screen: 'ValidateEmailChange',
      linking: {
        path: 'changement-email/validation',
      },
    },
    ChangePassword: {
      screen: 'ChangePassword',
      linking: {
        path: 'profil/modification-mot-de-passe',
      },
    },
    FeedbackInApp: {
      screen: 'FeedbackInApp',
      linking: {
        path: 'profil/formulaire-suggestion',
      },
    },
    DisplayPreference: {
      screen: 'DisplayPreference',
      linking: {
        path: 'profil/preference-affichage',
      },
    },
    ConsentSettings: {
      screen: 'ConsentSettings',
      linking: {
        path: 'profil/confidentialite',
      },
    },
    ConfirmChangeEmail: {
      screen: 'ConfirmChangeEmail',
      linking: {
        path: 'changement-email/confirmation',
      },
    },
    ChangeEmailSetPassword: {
      screen: 'ChangeEmailSetPassword',
      linking: {
        path: 'profil/creation-mot-de-passe',
      },
    },
    NewEmailSelection: {
      screen: 'NewEmailSelection',
      linking: {
        path: 'profil/nouvelle-adresse-email',
      },
    },
    ProfileTutorialAgeInformationCredit: {
      screen: 'ProfileTutorialAgeInformationCredit',
      linking: {
        path: 'profil/tutoriel',
      },
    },
    MandatoryUpdatePersonalData: {
      screen: 'MandatoryUpdatePersonalData',
      linking: {
        path: 'profil/mise-a-jour-informations-personnelles',
      },
    },
    UpdatePersonalDataConfirmation: {
      screen: 'UpdatePersonalDataConfirmation',
      linking: {
        path: 'profil/confirmation-mise-a-jour-informations-personnelles',
      },
    },
    ProfileInformationValidationUpdate: {
      screen: 'ProfileInformationValidationUpdate',
      linking: {
        path: 'profil/verification-informations-personnelles',
      },
    },
  },
}
