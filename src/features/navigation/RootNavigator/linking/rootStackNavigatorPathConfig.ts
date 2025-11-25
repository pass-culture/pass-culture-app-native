import { cheatcodesStackNavigatorPathConfig } from 'features/navigation/CheatcodesStackNavigator/cheatcodesStackNavigatorPathConfig'
import { onboardingStackNavigatorPathConfig } from 'features/navigation/OnboardingStackNavigator/onboardingStackNavigatorPathConfig'
import { profileStackNavigatorPathConfig } from 'features/navigation/ProfileStackNavigator/profileStackNavigatorPathConfig'
import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { subscriptionStackNavigatorPathConfig } from 'features/navigation/SubscriptionStackNavigator/subscriptionStackNavigatorPathConfig'
import { SearchView } from 'features/search/types'

const rootStackNavigatorPathsConfig = {
  groups: {
    Account: {
      screens: {
        AccountCreated: 'creation-compte/confirmation',
        AfterSignupEmailValidationBuffer: {
          path: 'signup-confirmation',
          parse: screenParamsParser.AfterSignupEmailValidationBuffer,
          alias: ['creation-compte/validation-email'],
        },
        AccountStatusScreenHandler: 'compte-desactive',
        SuspendedAccountUponUserRequest: 'compte-suspendu-a-la-demande',
        FraudulentSuspendedAccount: 'compte-suspendu-pour-fraude',
        AccountReactivationSuccess: 'compte-reactive',
        AccountSecurityBuffer: 'securisation-compte',
        AccountSecurity: {
          path: 'securisation-compte/choix',
          parse: screenParamsParser['ReinitializePassword'],
        },
      },
    },
    Authentication: {
      screens: {
        ChangeEmailExpiredLink: 'lien-modification-email-expire',
        ForgottenPassword: 'mot-de-passe-oublie',
        Login: {
          path: 'connexion',
          parse: screenParamsParser.Login,
        },
        ReinitializePassword: {
          path: 'mot-de-passe-perdu',
          parse: screenParamsParser.ReinitializePassword,
        },
        ResetPasswordEmailSent: 'email-modification-mot-de-passe-envoye',
        ResetPasswordExpiredLink: 'email-modification-mot-de-passe-expire',
        SignupForm: {
          path: 'creation-compte',
          alias: ['creation-compte/email'],
        },
        SignupConfirmationEmailSent: 'email-confirmation-creation-compte/envoye',
        SignupConfirmationExpiredLink: 'email-confirmation-creation-compte/expire',
      },
    },
    Birthday: {
      screens: {
        EighteenBirthday: {
          path: 'anniversaire-18-ans',
          alias: ['eighteen'],
        },
        RecreditBirthdayNotification: {
          path: 'recharge-credit-anniversaire',
          alias: ['recredit-birthday'],
        },
        VerifyEligibility: 'verification-eligibilite',
        NotYetUnderageEligibility: 'cest-pour-bientot',
      },
    },
    Booking: {
      screens: {
        BookingDetails: {
          path: 'reservation/:id/details',
          parse: screenParamsParser.BookingDetails,
          alias: ['booking/:id/details'],
        },
        BookingConfirmation: {
          path: 'reservation/:offerId/confirmation',
          parse: screenParamsParser.BookingConfirmation,
          alias: ['booking/:offerId/confirmation'],
        },
      },
    },
    Offer: {
      screens: {
        Offer: {
          path: 'offre/:id',
          parse: screenParamsParser.Offer,
          alias: ['offer/:id', 'offre', 'offer'],
        },
        OfferPreview: {
          path: 'offre/:id/apercu',
          parse: screenParamsParser.OfferPreview,
          alias: ['offer/:id/apercu', 'offre/apercu', 'offer/apercu'],
        },
        OfferVideoPreview: {
          path: 'offre/:id/video',
          parse: screenParamsParser.OfferVideoPreview,
        },
      },
    },
    Suspension: {
      screens: {
        SuspensionChoice: 'securisation-compte/suspension',
        SuspensionChoiceExpiredLink: 'securisation-compte/lien-suspension-compte-expire',
        SuspiciousLoginSuspendedAccount: 'securisation-compte/suspension-confirmee',
      },
    },
    Tools: {
      screens: {
        DeeplinksGenerator: 'liens/generateur',
        UTMParameters: 'liens/utm',
        PageNotFound: '*',
      },
    },
    Venue: {
      Venue: {
        path: 'lieu/:id',
        parse: screenParamsParser.Venue,
        alias: ['venue/:id'],
      },
      VenueMap: {
        path: 'carte-des-lieux',
      },
      VenuePreviewCarousel: {
        path: 'lieu/:id/apercu',
        parse: screenParamsParser.VenuePreviewCarousel,
        alias: ['venue/:id/apercu', 'lieu/apercu', 'venue/apercu'],
      },
    },
  },
  Achievements: 'profil/succes',
  Artist: {
    path: 'artiste/:id',
    alias: ['artist/:id'],
  },
  BannedCountryError: 'erreur-pays',
  Chronicles: {
    path: 'avis-du-book-club/:offerId/:chronicleId',
    parse: screenParamsParser.Chronicles,
    alias: ['chronicles/:offerId/:chronicleId'],
  },
  FavoritesSorts: 'favoris/tri',
  OnboardingSubscription: 'choix-abonnement',
  SearchFilter: {
    path: 'recherche/filtres',
    parse: screenParamsParser.SearchFilter,
    stringify: screenParamsStringifier.SearchFilter,
  },
  ThematicHome: {
    path: 'accueil-thematique',
    parse: screenParamsParser.ThematicHome,
    alias: ['thematic-home'],
  },
}

export const rootStackNavigatorPathConfig = {
  CheatcodesStackNavigator: {
    screens: cheatcodesStackNavigatorPathConfig,
  },
  ProfileStackNavigator: {
    screens: profileStackNavigatorPathConfig,
  },
  OnboardingStackNavigator: {
    screens: onboardingStackNavigatorPathConfig,
  },
  SubscriptionStackNavigator: {
    screens: subscriptionStackNavigatorPathConfig,
  },
  TabNavigator: {
    screens: {
      Home: {
        path: 'accueil',
        parse: screenParamsParser.Home,
        alias: ['home'],
      },
      Bookings: {
        path: 'reservations',
        alias: ['bookings'],
      },
      Favorites: {
        path: 'favoris',
      },
      Profile: {
        path: 'profil',
      },
      SearchStackNavigator: {
        screens: {
          SearchLanding: {
            path: 'recherche/accueil',
            parse: screenParamsParser[SearchView.Landing],
            stringify: screenParamsStringifier[SearchView.Landing],
          },
          SearchResults: {
            path: 'recherche/resultats',
            parse: screenParamsParser[SearchView.Results],
            stringify: screenParamsStringifier[SearchView.Results],
          },
          ThematicSearch: {
            path: 'recherche/thematique',
            parse: screenParamsParser[SearchView.Thematic],
            stringify: screenParamsStringifier[SearchView.Thematic],
          },
        },
      },
    },
  },
  ...rootStackNavigatorPathsConfig,
}
