import { cheatcodesStackNavigatorPathConfig } from 'features/navigation/CheatcodesStackNavigator/cheatcodesStackNavigatorPathConfig'
import { onboardingStackNavigatorPathConfig } from 'features/navigation/OnboardingStackNavigator/onboardingStackNavigatorPathConfig'
import { profileStackNavigatorPathConfig } from 'features/navigation/ProfileStackNavigator/profileStackNavigatorPathConfig'
import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { SearchView } from 'features/search/types'

export const rootStackNavigatorPathConfig = {
  ...cheatcodesStackNavigatorPathConfig,
  ...profileStackNavigatorPathConfig,
  ...onboardingStackNavigatorPathConfig,
  TabNavigator: {
    screens: {
      Home: {
        path: 'accueil',
        parse: screenParamsParser['Home'],
      },
      _DeeplinkOnlyHome1: {
        path: 'home',
        parse: screenParamsParser['Home'],
      },
      Bookings: {
        path: 'reservations',
      },
      _DeeplinkOnlyBookings1: {
        path: 'bookings',
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
  SubscriptionStackNavigator: {
    screens: {
      CulturalSurveyIntro: {
        path: 'questionnaire-pratiques-initiales/introduction',
      },
      CulturalSurveyQuestions: {
        path: 'questionnaire-pratiques-initiales/questions',
      },
      CulturalSurveyThanks: {
        path: 'questionnaire-pratiques-initiales/merci',
      },
      FAQWebview: {
        path: 'questionnaire-pratiques-initiales/foire-aux-questions',
      },
      Stepper: {
        path: 'verification-identite',
      },
      DisableActivation: {
        path: 'creation-compte/desactivation',
      },
      SetPhoneNumberWithoutValidation: {
        path: 'creation-compte/telephone-sans-validation',
      },
      SetPhoneNumber: {
        path: 'creation-compte/telephone',
      },
      SetPhoneValidationCode: {
        path: 'creation-compte/code-de-validation-telephone',
      },
      PhoneValidationTooManyAttempts: {
        path: 'creation-compte/code-de-validation-trop-d-essais',
      },
      PhoneValidationTooManySMSSent: {
        path: 'creation-compte/code-de-validation-trop-de-sms',
      },
      SetName: {
        path: 'creation-profil/nom-prenom',
      },
      SetCity: {
        path: 'creation-profil/ville',
      },
      SetAddress: {
        path: 'creation-profil/adresse',
      },
      SetStatus: {
        path: 'verification-identite/profil/statut',
      },
      SetProfileBookingError: {
        path: 'verification-identite/profil/statut/erreur',
      },
      ProfileInformationValidationCreate: {
        path: 'verification-identite/profil/validation-informations',
      },
      UbbleWebview: {
        path: 'identification/verification-manuelle-piece-identite',
      },
      EduConnectForm: {
        path: 'educonnect-formulaire',
      },
      EduConnectValidation: {
        path: 'educonnect/validation',
      },
      IdentityCheckEnd: {
        path: 'verification-identite/fin',
      },
      IdentityCheckUnavailable: {
        path: 'verification-identite/verification-indisponible',
      },
      IdentityCheckPending: {
        path: 'verification-identite/demande-en-attente',
      },
      IdentityCheckDMS: {
        path: 'verification-identite/demarches-simplifiees',
      },
      IdentificationFork: {
        path: 'identification/fourche',
      },
      IdentityCheckHonor: {
        path: 'confirmation',
      },
      BeneficiaryRequestSent: {
        path: 'demande-beneficiaire-envoyee',
      },
      BeneficiaryAccountCreated: {
        path: 'creation-compte/confirmation-beneficiaire',
      },
      EduConnectErrors: {
        path: 'educonnect/erreur',
      },
      DMSIntroduction: {
        path: 'identification/redirection-demarches-simplifiees',
      },
      ExpiredOrLostID: {
        path: 'identification/document-identite-perdu-ou-expire',
      },
      SelectIDOrigin: {
        path: 'identification/origine-document-identite',
      },
      SelectIDStatus: {
        path: 'identification/statut-document-identite',
      },
      SelectPhoneStatus: {
        path: 'identification/statut-telephone',
      },
      ComeBackLater: {
        path: 'identification/reviens-plus-tard',
      },
      BonificationIntroduction: {
        path: 'bonification/introduction',
      },
      BonificationNames: {
        path: 'bonification/noms',
      },
      BonificationTitle: {
        path: 'bonification/civilite',
      },
      BonificationBirthDate: {
        path: 'bonification/date-de-naissance',
      },
      BonificationBirthPlace: {
        path: 'bonification/lieu-de-naissance',
      },
      BonificationRecap: {
        path: 'bonification/resume',
      },
      BonificationError: {
        path: 'bonification/erreur',
      },
    },
  },
  AccountSecurityBuffer: {
    path: 'securisation-compte',
  },
  AccountSecurity: {
    path: 'securisation-compte/choix',
    parse: screenParamsParser['ReinitializePassword'],
  },
  SuspensionChoice: {
    path: 'securisation-compte/suspension',
  },
  SuspensionChoiceExpiredLink: {
    path: 'securisation-compte/lien-suspension-compte-expire',
  },
  SuspiciousLoginSuspendedAccount: {
    path: 'securisation-compte/suspension-confirmee',
  },
  Offer: {
    path: 'offre/:id',
    parse: screenParamsParser['Offer'],
  },
  _DeeplinkOnlyOffer1: {
    path: 'offer/:id',
    parse: screenParamsParser['Offer'],
  },
  _DeeplinkOnlyOffer2: {
    path: 'offre',
    parse: screenParamsParser['Offer'],
  },
  _DeeplinkOnlyOffer3: {
    path: 'offer',
    parse: screenParamsParser['Offer'],
  },
  OfferPreview: {
    path: 'offre/:id/apercu',
    parse: screenParamsParser['OfferPreview'],
  },
  _DeeplinkOnlyOfferPreview1: {
    path: 'offer/:id/apercu',
    parse: screenParamsParser['OfferPreview'],
  },
  _DeeplinkOnlyOfferPreview2: {
    path: 'offre/apercu',
    parse: screenParamsParser['OfferPreview'],
  },
  _DeeplinkOnlyOfferPreview3: {
    path: 'offer/apercu',
    parse: screenParamsParser['OfferPreview'],
  },
  OfferVideoPreview: {
    path: 'offre/:id/video',
    parse: screenParamsParser['OfferVideoPreview'],
  },
  BookingDetails: {
    path: 'reservation/:id/details',
    parse: screenParamsParser['BookingDetails'],
  },
  _DeeplinkOnlyBookingDetails1: {
    path: 'booking/:id/details',
    parse: screenParamsParser['BookingDetails'],
  },
  BookingConfirmation: {
    path: 'reservation/:offerId/confirmation',
    parse: screenParamsParser['BookingConfirmation'],
  },
  _DeeplinkOnlyBookingConfirmation1: {
    path: 'booking/:offerId/confirmation',
    parse: screenParamsParser['BookingConfirmation'],
  },
  EighteenBirthday: {
    path: 'anniversaire-18-ans',
  },
  _DeeplinkOnlyEighteenBirthday1: {
    path: 'eighteen',
  },
  RecreditBirthdayNotification: {
    path: 'recharge-credit-anniversaire',
  },
  _DeeplinkOnlyRecreditBirthdayNotification1: {
    path: 'recredit-birthday',
  },
  PageNotFound: {
    path: '*',
  },
  AccountCreated: {
    path: 'creation-compte/confirmation',
  },
  AfterSignupEmailValidationBuffer: {
    path: 'signup-confirmation',
    parse: screenParamsParser['AfterSignupEmailValidationBuffer'],
  },
  _DeeplinkOnlyAfterSignupEmailValidationBuffer1: {
    path: 'creation-compte/validation-email',
    parse: screenParamsParser['AfterSignupEmailValidationBuffer'],
  },
  BannedCountryError: {
    path: 'erreur-pays',
  },
  ChangeEmailExpiredLink: {
    path: 'lien-modification-email-expire',
  },
  FavoritesSorts: {
    path: 'favoris/tri',
  },
  ForgottenPassword: {
    path: 'mot-de-passe-oublie',
  },
  AccountStatusScreenHandler: {
    path: 'compte-desactive',
  },
  SuspendedAccountUponUserRequest: {
    path: 'compte-suspendu-a-la-demande',
  },
  FraudulentSuspendedAccount: {
    path: 'compte-suspendu-pour-fraude',
  },
  AccountReactivationSuccess: {
    path: 'compte-reactive',
  },
  Login: {
    path: 'connexion',
    parse: screenParamsParser['Login'],
  },
  OnboardingSubscription: {
    path: 'choix-abonnement',
  },
  ReinitializePassword: {
    path: 'mot-de-passe-perdu',
    parse: screenParamsParser['ReinitializePassword'],
  },
  ResetPasswordEmailSent: {
    path: 'email-modification-mot-de-passe-envoye',
  },
  ResetPasswordExpiredLink: {
    path: 'email-modification-mot-de-passe-expire',
  },
  SignupForm: {
    path: 'creation-compte',
  },
  _DeeplinkOnlySignupForm1: {
    path: 'creation-compte/email',
  },
  SignupConfirmationEmailSent: {
    path: 'email-confirmation-creation-compte/envoye',
  },
  SignupConfirmationExpiredLink: {
    path: 'email-confirmation-creation-compte/expire',
  },
  SearchFilter: {
    path: 'recherche/filtres',
    parse: screenParamsParser['SearchFilter'],
    stringify: screenParamsStringifier['SearchFilter'],
  },
  VerifyEligibility: {
    path: 'verification-eligibilite',
  },
  NotYetUnderageEligibility: {
    path: 'cest-pour-bientot',
  },
  Venue: {
    path: 'lieu/:id',
    parse: screenParamsParser['Venue'],
  },
  _DeeplinkOnlyVenue1: {
    path: 'venue/:id',
    parse: screenParamsParser['Venue'],
  },
  VenueMap: {
    path: 'carte-des-lieux',
  },
  VenuePreviewCarousel: {
    path: 'lieu/:id/apercu',
    parse: screenParamsParser['VenuePreviewCarousel'],
  },
  _DeeplinkOnlyVenuePreviewCarousel1: {
    path: 'venue/:id/apercu',
    parse: screenParamsParser['VenuePreviewCarousel'],
  },
  _DeeplinkOnlyVenuePreviewCarousel2: {
    path: 'lieu/apercu',
    parse: screenParamsParser['VenuePreviewCarousel'],
  },
  _DeeplinkOnlyVenuePreviewCarousel3: {
    path: 'venue/apercu',
    parse: screenParamsParser['VenuePreviewCarousel'],
  },
  Artist: {
    path: 'artiste/:id',
  },
  _DeeplinkOnlyArtist1: {
    path: 'artist/:id',
  },
  DeeplinksGenerator: {
    path: 'liens/generateur',
  },
  UTMParameters: {
    path: 'liens/utm',
  },
  ThematicHome: {
    path: 'accueil-thematique',
    parse: screenParamsParser['ThematicHome'],
  },
  _DeeplinkOnlyThematicHome1: {
    path: 'thematic-home',
    parse: screenParamsParser['ThematicHome'],
  },
  Achievements: {
    path: 'profil/succes',
  },
  Chronicles: {
    path: 'avis-du-book-club/:offerId/:chronicleId',
    parse: screenParamsParser['Chronicles'],
  },
  _DeeplinkOnlyChronicles1: {
    path: 'chronicles/:offerId/:chronicleId',
    parse: screenParamsParser['Chronicles'],
  },
}
