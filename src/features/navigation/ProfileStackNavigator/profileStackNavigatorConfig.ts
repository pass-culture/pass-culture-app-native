export const profileStackNavigatorConfig = {
  ProfileStackNavigator: {
    initialRouteName: 'Accessibility',
    screens: {
      Accessibility: {
        path: 'accessibilite',
      },
      AccessibilityEngagement: {
        path: 'accessibilite/engagements',
      },
      AccessibilityActionPlan: {
        path: 'accessibilite/plan-d-actions',
      },
      AccessibilityDeclarationMobile: {
        path: 'accessibilite/declaration-accessibilite-mobile',
      },
      AccessibilityDeclarationWeb: {
        path: 'accessibilite/declaration-accessibilite-web',
      },
      RecommendedPaths: {
        path: 'accessibilite/parcours-recommandes',
      },
      SiteMapScreen: {
        path: 'accessibilite/plan-du-site',
      },
      NotificationsSettings: {
        path: 'profil/notifications',
      },
      DeleteProfileReason: {
        path: 'profil/suppression/raison',
      },
      DeleteProfileContactSupport: {
        path: 'profil/suppression/support',
      },
      DeleteProfileEmailHacked: {
        path: 'profil/suppression/email-pirate',
      },
      DeleteProfileAccountHacked: {
        path: 'profil/suppression/compte-pirate',
      },
      DeleteProfileAccountNotDeletable: {
        path: 'profil/suppression/information',
      },
      DebugScreen: {
        path: 'profil/débuggage',
      },
      ConfirmDeleteProfile: {
        path: 'profil/suppression',
      },
      DeleteProfileConfirmation: {
        path: 'profile/suppression/confirmation',
      },
      DeleteProfileSuccess: {
        path: 'profile/suppression/succes',
      },
      DeactivateProfileSuccess: {
        path: 'profile/desactivation/succes',
      },
      SuspendAccountConfirmationWithoutAuthentication: {
        path: 'profile/suppression/demande-confirmation',
      },
      SuspendAccountConfirmation: {
        path: 'suspension-compte/confirmation',
      },
      ChangeStatus: {
        path: 'profil/modification-statut',
      },
      ChangeCity: {
        path: 'profil/modification-ville',
      },
      ChangeEmail: {
        path: 'profil/modification-email',
      },
      TrackEmailChange: {
        path: 'profil/suivi-modification-email',
      },
      LegalNotices: {
        path: 'notices-legales',
      },
      PersonalData: {
        path: 'profil/donnees-personnelles',
      },
      ValidateEmailChange: {
        path: 'changement-email/validation',
      },
      ChangePassword: {
        path: 'profil/modification-mot-de-passe',
      },
      FeedbackInApp: {
        path: 'profil/formulaire-suggestion',
      },
      DisplayPreference: {
        path: 'profil/preference-affichage',
      },
      ConsentSettings: {
        path: 'profil/confidentialite',
      },
      ConfirmChangeEmail: {
        path: 'changement-email/confirmation',
      },
      ChangeEmailSetPassword: {
        path: 'profil/creation-mot-de-passe',
      },
      NewEmailSelection: {
        path: 'profil/nouvelle-adresse-email',
      },
      ProfileTutorialAgeInformationCredit: {
        path: 'profil/tutoriel',
      },
    },
  },
}
