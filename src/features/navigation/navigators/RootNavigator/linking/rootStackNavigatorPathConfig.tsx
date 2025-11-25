import { createPathConfigForStaticNavigation } from '@react-navigation/native'

import { Artist } from 'features/artist/pages/Artist'
import { ArtistWebview } from 'features/artist/pages/ArtistWebview'
import { ForgottenPassword } from 'features/auth/pages/forgottenPassword/ForgottenPassword/ForgottenPassword'
import { ReinitializePassword } from 'features/auth/pages/forgottenPassword/ReinitializePassword/ReinitializePassword'
import { ResetPasswordEmailSent } from 'features/auth/pages/forgottenPassword/ResetPasswordEmailSent/ResetPasswordEmailSent'
import { ResetPasswordExpiredLink } from 'features/auth/pages/forgottenPassword/ResetPasswordExpiredLink/ResetPasswordExpiredLink'
import { Login } from 'features/auth/pages/login/Login'
import { AccountCreated } from 'features/auth/pages/signup/AccountCreated/AccountCreated'
import { AfterSignupEmailValidationBuffer } from 'features/auth/pages/signup/AfterSignupEmailValidationBuffer/AfterSignupEmailValidationBuffer'
import { NotYetUnderageEligibility } from 'features/auth/pages/signup/NotYetUnderageEligibility/NotYetUnderageEligibility'
import { SignupConfirmationEmailSent } from 'features/auth/pages/signup/SignupConfirmationEmailSent/SignupConfirmationEmailSent'
import { SignupConfirmationExpiredLink } from 'features/auth/pages/signup/SignupConfirmationExpiredLink/SignupConfirmationExpiredLink'
import { SignupForm } from 'features/auth/pages/signup/SignupForm'
import { VerifyEligibility } from 'features/auth/pages/signup/VerifyEligiblity/VerifyEligibility'
import { AccountReactivationSuccess } from 'features/auth/pages/suspendedAccount/AccountReactivationSuccess/AccountReactivationSuccess'
import { AccountStatusScreenHandler } from 'features/auth/pages/suspendedAccount/AccountStatusScreenHandler/AccountStatusScreenHandler'
import { FraudulentSuspendedAccount } from 'features/auth/pages/suspendedAccount/FraudulentSuspendedAccount/FraudulentSuspendedAccount'
import { EighteenBirthday } from 'features/birthdayNotifications/pages/EighteenBirthday'
import { RecreditBirthdayNotification } from 'features/birthdayNotifications/pages/RecreditBirthdayNotification'
import { BookingDetails } from 'features/bookOffer/components/BookingDetails'
import { BookingConfirmation } from 'features/bookOffer/pages/BookingConfirmation'
import { Chronicles } from 'features/chronicle/pages/Chronicles/Chronicles'
import { BannedCountryError } from 'features/errors/pages/BannedCountryError'
import { FavoritesSorts } from 'features/favorites/pages/FavoritesSorts'
import { ThematicHome } from 'features/home/pages/ThematicHome'
import { DeeplinksGenerator } from 'features/internal/pages/DeeplinksGenerator'
import { UTMParameters } from 'features/internal/pages/UTMParameters'
import {
  screenParamsParser,
  screenParamsStringifier,
} from 'features/navigation/helpers/screenParamsUtils'
import { CheatcodesStackNavigator } from 'features/navigation/navigators/CheatcodesStackNavigator/CheatcodesStackNavigator'
import { OnboardingStackNavigator } from 'features/navigation/navigators/OnboardingStackNavigator/OnboardingStackNavigator'
import { ProfileStackNavigator } from 'features/navigation/navigators/ProfileStackNavigator/ProfileStackNavigator'
import { SubscriptionStackNavigator } from 'features/navigation/navigators/SubscriptionStackNavigator/SubscriptionStackNavigator'
import { BottomTabNavigator } from 'features/navigation/navigators/TabNavigator/TabStackNavigator'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { OfferPreview } from 'features/offer/pages/OfferPreview/OfferPreview'
import { OfferVideoPreview } from 'features/offer/pages/OfferVideoPreview/OfferVideoPreview'
import { ChangeEmailExpiredLink } from 'features/profile/pages/ChangeEmail/ChangeEmailExpiredLink'
import { MandatoryUpdatePersonalData } from 'features/profile/pages/MandatoryUpdatePersonalData/MandatoryUpdatePersonalData'
import { SearchFilter } from 'features/search/pages/SearchFilter/SearchFilter'
import { OnboardingSubscription } from 'features/subscription/page/OnboardingSubscription'
import { AccountSecurity } from 'features/trustedDevice/pages/AccountSecurity'
import { AccountSecurityBuffer } from 'features/trustedDevice/pages/AccountSecurityBuffer'
import { SuspensionChoice } from 'features/trustedDevice/pages/SuspensionChoice'
import { SuspensionChoiceExpiredLink } from 'features/trustedDevice/pages/SuspensionChoiceExpiredLink'
import { SuspiciousLoginSuspendedAccount } from 'features/trustedDevice/pages/SuspiciousLoginSuspendedAccount'
import { VenuePreviewCarousel } from 'features/venue/pages/VenuePreviewCarousel/VenuePreviewCarousel'
import { VenueMap } from 'features/venueMap/pages/VenueMap/VenueMap'
import { PageNotFound } from 'ui/svg/icons/PageNotFound'
import { Venue } from 'ui/svg/icons/Venue'

const rootStackNavigatorPathDefinition = {
  Account: {
    screens: {
      AccountCreated: {
        screen: AccountCreated,
        path: 'creation-compte/confirmation',
        options: { title: 'Compte créé\u00a0!' },
      },
      AfterSignupEmailValidationBuffer: {
        screen: AfterSignupEmailValidationBuffer,
        path: 'signup-confirmation',
        parse: screenParamsParser.AfterSignupEmailValidationBuffer,
        alias: ['creation-compte/validation-email'],
      },
      AccountStatusScreenHandler: {
        screen: AccountStatusScreenHandler,
        path: 'compte-desactive',
        options: { title: 'Compte désactivé' },
      },
      SuspendedAccountUponUserRequest: {
        screen: AccountStatusScreenHandler,
        path: 'compte-suspendu-a-la-demande',
        options: { title: 'Compte désactivé' },
      },
      FraudulentSuspendedAccount: {
        screen: FraudulentSuspendedAccount,
        path: 'compte-suspendu-pour-fraude',
        options: { title: 'Compte suspendu' },
      },
      AccountReactivationSuccess: {
        screen: AccountReactivationSuccess,
        path: 'compte-reactive',
        options: { title: 'Compte réactivé' },
      },
      AccountSecurityBuffer: {
        screen: AccountSecurityBuffer,
        path: 'securisation-compte',
      },
      AccountSecurity: {
        screen: AccountSecurity,
        path: 'securisation-compte/choix',
        parse: screenParamsParser.ReinitializePassword,
        options: { title: 'Demande de sécurisation de compte' },
      },
      MandatoryUpdatePersonalData: {
        screen: MandatoryUpdatePersonalData,
        options: { title: 'Confirmation de la validité de tes données personnelles' },
      },
      Achievements: {
        path: 'profil/succes',
      },
      OnboardingSubscription: {
        screen: OnboardingSubscription,
        path: 'choix-abonnement',
        options: { title: 'Choix des thèmes à suivre' },
      },
      BannedCountryError: {
        screen: BannedCountryError,
        path: 'erreur-pays',
      },
    },
  },
  Authentication: {
    screens: {
      ChangeEmailExpiredLink: {
        screen: ChangeEmailExpiredLink,
        path: 'lien-modification-email-expire',
        parse: screenParamsParser.ReinitializePassword,
        options: { title: 'Lien de modification de l’email expiré' },
      },
      ForgottenPassword: {
        screen: ForgottenPassword,
        path: 'mot-de-passe-oublie',
        parse: screenParamsParser.ReinitializePassword,
        options: { title: 'Mot de passe oublié' },
      },
      Login: {
        screen: Login,
        path: 'connexion',
        parse: screenParamsParser.Login,
        options: { title: 'Connexion' },
      },
      ReinitializePassword: {
        screen: ReinitializePassword,
        path: 'mot-de-passe-perdu',
        parse: screenParamsParser.ReinitializePassword,
        options: { title: 'Réinitialiser le mot de passe' },
      },
      ResetPasswordEmailSent: {
        screen: ResetPasswordEmailSent,
        path: 'email-modification-mot-de-passe-envoye',
        options: { title: 'Email modification mot de passe envoyé' },
      },
      ResetPasswordExpiredLink: {
        screen: ResetPasswordExpiredLink,
        path: 'email-modification-mot-de-passe-expire',
        options: { title: 'Email modification mot de passe expiré' },
      },
      SignupForm: {
        screen: SignupForm,
        path: 'creation-compte',
        alias: ['creation-compte/email'],
        options: { title: 'Création de compte' },
      },
      SignupConfirmationEmailSent: {
        screen: SignupConfirmationEmailSent,
        path: 'email-confirmation-creation-compte/envoye',
        options: { title: 'Email création de compte envoyé' },
      },
      SignupConfirmationExpiredLink: {
        screen: SignupConfirmationExpiredLink,
        path: 'email-confirmation-creation-compte/expire',
        options: { title: 'Email création de compte expiré' },
      },
    },
  },
  Birthday: {
    screens: {
      EighteenBirthday: {
        screen: EighteenBirthday,
        path: 'anniversaire-18-ans',
        alias: ['eighteen'],
        options: { title: 'Anniversaire 18 ans' },
      },
      RecreditBirthdayNotification: {
        screen: RecreditBirthdayNotification,
        path: 'recharge-credit-anniversaire',
        alias: ['recredit-birthday'],
        options: { title: 'Notification rechargement anniversaire' },
      },
      VerifyEligibility: {
        screen: VerifyEligibility,
        path: 'verification-eligibilite',
        options: { title: 'Vérification éligibilité' },
      },
      NotYetUnderageEligibility: {
        screen: NotYetUnderageEligibility,
        path: 'cest-pour-bientot',
        options: { title: 'C’est pour bientôt' },
      },
    },
  },
  Booking: {
    screens: {
      BookingDetails: {
        screen: BookingDetails,
        path: 'reservation/:id/details',
        parse: screenParamsParser.BookingDetails,
        alias: ['booking/:id/details'],
      },
      BookingConfirmation: {
        screen: BookingConfirmation,
        path: 'reservation/:offerId/confirmation',
        parse: screenParamsParser.BookingConfirmation,
        alias: ['booking/:offerId/confirmation'],
        options: { title: 'Confirmation de réservation' },
      },
    },
  },
  Misc: {
    screens: {
      FavoritesSorts: {
        screen: FavoritesSorts,
        path: 'favoris/tri',
        options: { title: 'Tri des favoris' },
      },
      SearchFilter: {
        screen: SearchFilter,
        path: 'recherche/filtres',
        parse: screenParamsParser.SearchFilter,
        stringify: screenParamsStringifier.SearchFilter,
        options: { title: 'Filtres de recherche' },
      },
      ThematicHome: {
        screen: ThematicHome,
        path: 'accueil-thematique',
        parse: screenParamsParser.ThematicHome,
        alias: ['thematic-home'],
        options: { title: 'Page d’accueil thématique' },
      },
      Artist: {
        screen: Artist,
        path: 'artiste/:id',
        alias: ['artist/:id'],
        options: { title: 'Artiste' },
      },
      ArtistWebview: {
        screen: ArtistWebview,
        path: 'artiste/wikipedia/:id',
        alias: ['artist/wikipedia/:id'],
        options: { title: 'Artiste sur Wikipédia' },
      },
      Chronicles: {
        screen: Chronicles,
        path: 'avis-du-book-club/:offerId/:chronicleId',
        parse: screenParamsParser.Chronicles,
        alias: ['chronicles/:offerId/:chronicleId'],
        options: { title: 'Avis du book club' },
      },
    },
  },
  Offer: {
    screens: {
      Offer: {
        screen: Offer,
        path: 'offre/:id',
        parse: screenParamsParser.Offer,
        alias: ['offer/:id', 'offre', 'offer'],
      },
      OfferPreview: {
        screen: OfferPreview,
        path: 'offre/:id/apercu',
        parse: screenParamsParser.OfferPreview,
        alias: ['offer/:id/apercu', 'offre/apercu', 'offer/apercu'],
        options: { title: 'Aperçu de l’offre' },
      },
      OfferVideoPreview: {
        screen: OfferVideoPreview,
        path: 'offre/:id/video',
        parse: screenParamsParser.OfferVideoPreview,
      },
    },
  },
  Suspension: {
    screens: {
      SuspensionChoice: {
        screen: SuspensionChoice,
        path: 'securisation-compte/suspension',
        options: { title: 'Demande de suspension de compte' },
      },
      SuspensionChoiceExpiredLink: {
        screen: SuspensionChoiceExpiredLink,
        path: 'securisation-compte/lien-suspension-compte-expire',
        options: { title: 'Lien de suspension de compte expiré' },
      },
      SuspiciousLoginSuspendedAccount: {
        screen: SuspiciousLoginSuspendedAccount,
        path: 'securisation-compte/suspension-confirmee',
        options: { title: 'Confirmation de suspension de compte' },
      },
    },
  },
  Tools: {
    screens: {
      DeeplinksGenerator: {
        screen: DeeplinksGenerator,
        path: 'liens/generateur',
        options: { title: 'Générateur de lien' },
      },
      UTMParameters: {
        screen: UTMParameters,
        path: 'liens/utm',
        options: { title: 'Paramètres UTM' },
      },
      PageNotFound: {
        screen: PageNotFound,
        path: '*',
        options: { title: 'Page introuvable' },
      },
    },
  },
  Venue: {
    screens: {
      Venue: {
        screen: Venue,
        path: 'lieu/:id',
        parse: screenParamsParser.Venue,
        alias: ['venue/:id'],
        options: { title: 'Lieu' },
      },
      VenueMap: {
        screen: VenueMap,
        path: 'carte-des-lieux',
        options: { title: 'Carte des lieux' },
      },
      VenuePreviewCarousel: {
        screen: VenuePreviewCarousel,
        path: 'lieu/:id/apercu',
        parse: screenParamsParser.VenuePreviewCarousel,
        alias: ['venue/:id/apercu', 'lieu/apercu', 'venue/apercu'],
        options: { title: 'Aperçu du lieu' },
      },
    },
  },
}

export const rootStackNavigatorPathConfig = {
  screens: {
    TabNavigator: {
      screens: createPathConfigForStaticNavigation(BottomTabNavigator),
    },
    CheatcodesStackNavigator: {
      screens: createPathConfigForStaticNavigation(CheatcodesStackNavigator),
    },
    ProfileStackNavigator: {
      screens: createPathConfigForStaticNavigation(ProfileStackNavigator),
    },
    OnboardingStackNavigator: {
      screens: createPathConfigForStaticNavigation(OnboardingStackNavigator),
    },
    SubscriptionStackNavigator: {
      screens: createPathConfigForStaticNavigation(SubscriptionStackNavigator),
    },
    groups: rootStackNavigatorPathDefinition,
  },
}
