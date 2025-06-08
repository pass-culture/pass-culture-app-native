export const onboardingStackNavigatorPathConfig = {
  OnboardingStackNavigator: {
    initialRouteName: 'OnboardingWelcome',
    screens: {
      OnboardingAgeSelectionFork: {
        path: 'selection-age/generique',
      },
      OnboardingAgeInformation: {
        path: 'selection-age/information',
      },
      OnboardingGeolocation: {
        path: 'geolocalisation',
      },
      OnboardingGeneralPublicWelcome: {
        path: 'bienvenue-grand-public',
      },
      OnboardingNotEligible: {
        path: 'non-eligible',
      },
      OnboardingWelcome: {
        path: 'bienvenue',
      },
    },
  },
}
