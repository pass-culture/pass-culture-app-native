import { createComponentForStaticNavigation } from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack'
import { Platform } from 'react-native'

import { CheatcodesMenu } from 'cheatcodes/pages/CheatcodesMenu'
import { CheatcodesNavigationAchievements } from 'cheatcodes/pages/features/achievements/CheatcodesNavigationAchievements'
import { CheatcodesNavigationBirthdayNotifications } from 'cheatcodes/pages/features/birthdayNotifications/CheatcodesNavigationBirthdayNotifications'
import { CheatcodesNavigationBonification } from 'cheatcodes/pages/features/bonification/CheatcodesNavigationBonification'
import { CheatcodesNavigationBookings } from 'cheatcodes/pages/features/bookings/CheatcodesNavigationBookings'
import { CheatcodesScreenBookingNotFound } from 'cheatcodes/pages/features/bookings/CheatcodesScreenBookingNotFound'
import { CheatcodesNavigationBookOffer } from 'cheatcodes/pages/features/bookOffer/CheatcodesNavigationBookOffer'
import { CheatcodesNavigationCulturalSurvey } from 'cheatcodes/pages/features/culturalSurvey/CheatcodesNavigationCulturalSurvey'
import { CheatcodesNavigationForceUpdate } from 'cheatcodes/pages/features/forceUpdate/CheatcodesNavigationForceUpdate'
import { CheatcodesNavigationHome } from 'cheatcodes/pages/features/home/CheatcodesNavigationHome'
import { CheatcodesScreenCategoryThematicHomeHeader } from 'cheatcodes/pages/features/home/CheatcodesScreenCategoryThematicHomeHeader'
import { CheatcodesScreenDefaultThematicHomeHeader } from 'cheatcodes/pages/features/home/CheatcodesScreenDefaultThematicHomeHeader'
import { CheatcodesScreenHighlightThematicHomeHeader } from 'cheatcodes/pages/features/home/CheatcodesScreenHighlightThematicHomeHeader'
import { CheatcodesNavigationIdentityCheck } from 'cheatcodes/pages/features/identityCheck/CheatcodesNavigationIdentityCheck'
import { CheatcodesNavigationNewIdentificationFlow } from 'cheatcodes/pages/features/identityCheck/CheatcodesNavigationNewIdentificationFlow'
import { CheatcodesScreenNotEligibleEduConnect } from 'cheatcodes/pages/features/identityCheck/CheatcodesScreenNotEligibleEduConnect'
import { CheatcodesNavigationInternal } from 'cheatcodes/pages/features/internal/CheatcodesNavigationInternal'
import { CheatcodesScreenMaintenance } from 'cheatcodes/pages/features/maintenance/CheatcodesScreenMaintenance'
import { CheatcodesScreenCinemaScreeningCardList } from 'cheatcodes/pages/features/offer/CheatcodesScreenCinemaScreeningCardList'
import { CheatcodesNavigationOnboarding } from 'cheatcodes/pages/features/onboarding/CheatcodesNavigationOnboarding'
import { CheatcodesNavigationProfile } from 'cheatcodes/pages/features/profile/CheatcodesNavigationProfile'
import { CheatcodesScreenRemoteBanners } from 'cheatcodes/pages/features/remoteBanners/CheatcodesScreenRemoteBanners'
import { CheatcodesNavigationReviewInApp } from 'cheatcodes/pages/features/reviewInApp/CheatcodesNavigationReviewInApp'
import { CheatcodesNavigationShare } from 'cheatcodes/pages/features/share/CheatcodesNavigationShare'
import { CheatcodesNavigationSubscription } from 'cheatcodes/pages/features/subscription/CheatcodesNavigationSubscription'
import { CheatcodesNavigationTrustedDevice } from 'cheatcodes/pages/features/trustedDevice/CheatcodesNavigationTrustedDevice'
import { CheatcodesScreenTrustedDeviceInfos } from 'cheatcodes/pages/features/trustedDevice/CheatcodesScreenTrustedDeviceInfos'
import { CheatcodesScreenABTest } from 'cheatcodes/pages/others/CheatcodesABTest/CheatcodesScreenABTest'
import { CheatcodesNavigationAccountManagement } from 'cheatcodes/pages/others/CheatcodesNavigationAccountManagement'
import { CheatcodesNavigationErrors } from 'cheatcodes/pages/others/CheatcodesNavigationErrors'
import { CheatcodesNavigationGenericPages } from 'cheatcodes/pages/others/CheatcodesNavigationGenericPages'
import { CheatcodesNavigationModals } from 'cheatcodes/pages/others/CheatcodesNavigationModals'
import { CheatcodesNavigationNotScreensPages } from 'cheatcodes/pages/others/CheatcodesNavigationNotScreensPages'
import { CheatcodesNavigationSignUp } from 'cheatcodes/pages/others/CheatcodesNavigationSignUp'
import { CheatcodesScreenAccesLibre } from 'cheatcodes/pages/others/CheatcodesScreenAccesLibre'
import { CheatcodesScreenAnalyticsDebugger } from 'cheatcodes/pages/others/CheatcodesScreenAnalyticsDebugger'
import { CheatcodesScreenPageHeaderWithoutPlaceholder } from 'cheatcodes/pages/others/CheatcodesScreenCheatcodesScreenPageHeaderWithoutPlaceholder'
import { CheatcodesScreenCinemaScreeningDetailsModal } from 'cheatcodes/pages/others/CheatcodesScreenCinemaScreeningDetailsModal'
import { CheatcodesScreenDebugInformations } from 'cheatcodes/pages/others/CheatcodesScreenDebugInformations'
import { CheatcodesScreenDirectIdAccess } from 'cheatcodes/pages/others/CheatcodesScreenDirectIdAccess'
import { CheatcodesScreenFeatureFlags } from 'cheatcodes/pages/others/CheatcodesScreenFeatureFlags'
import { CheatcodesScreenGenericErrorPage } from 'cheatcodes/pages/others/CheatcodesScreenGenericErrorPage'
import { CheatcodesScreenGenericInfoPage } from 'cheatcodes/pages/others/CheatcodesScreenGenericInfoPage'
import { CheatcodesScreenGenericInfoPageIllustrations } from 'cheatcodes/pages/others/CheatcodesScreenGenericInfoPageIllustrations'
import { CheatcodesScreenGenericOfficialPage } from 'cheatcodes/pages/others/CheatcodesScreenGenericOfficialPage'
import { CheatcodesScreenLastLoginInfo } from 'cheatcodes/pages/others/CheatcodesScreenLastLoginInfo'
import { CheatcodesScreenLayoutExpiredLink } from 'cheatcodes/pages/others/CheatcodesScreenLayoutExpiredLink'
import { CheatcodesScreenMandatoryUpdate } from 'cheatcodes/pages/others/CheatcodesScreenMandatoryUpdate'
import { CheatcodesScreenModalDetailed } from 'cheatcodes/pages/others/CheatcodesScreenModalDetailed'
import { CheatcodesScreenModalSimpleNotScrollable } from 'cheatcodes/pages/others/CheatcodesScreenModalSimpleNotScrollable'
import { CheatcodesScreenModalSimpleScrollable } from 'cheatcodes/pages/others/CheatcodesScreenModalSimpleScrollable'
import { CheatcodesScreenNewCaledonia } from 'cheatcodes/pages/others/CheatcodesScreenNewCaledonia'
import { CheatcodesScreenOffline } from 'cheatcodes/pages/others/CheatcodesScreenOffline'
import { CheatcodesScreenPageWithHeader } from 'cheatcodes/pages/others/CheatcodesScreenPageWithHeader'
import { CheatcodesScreenRemoteConfig } from 'cheatcodes/pages/others/CheatcodesScreenRemoteConfig'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { LoadingPage } from 'ui/pages/LoadingPage'

const isWeb = Platform.OS === 'web'
const modalType: NativeStackNavigationOptions = {
  presentation: isWeb ? 'transparentModal' : 'formSheet',
  sheetAllowedDetents: 'fitToContents',
  sheetCornerRadius: 8,
}

const cheatcodesStackNavigatorPathDefinition = {
  screenOptions: {
    headerShown: false,
  },
  screens: {
    /**** MENU ****/
    CheatcodesMenu: {
      screen: CheatcodesMenu,
      linking: { path: 'cheatcodes' },
      options: { title: 'Cheatcodes' },
    },
    /**** FEATURES ****/
    CheatcodesNavigationAchievements: {
      screen: CheatcodesNavigationAchievements,
      linking: { path: 'cheatcodes/achievements' },
      options: { title: 'Cheatcodes - Succès' },
    },
    CheatcodesNavigationBirthdayNotifications: {
      screen: CheatcodesNavigationBirthdayNotifications,
      linking: { path: 'cheatcodes/birthday-notifications' },
      options: { title: 'Cheatcodes - Notifications anniversaire' },
    },
    CheatcodesNavigationBookings: {
      screen: CheatcodesNavigationBookings,
      linking: { path: 'cheatcodes/bookings' },
      options: { title: 'Cheatcodes - Réservations' },
    },
    CheatcodesNavigationBookOffer: {
      screen: CheatcodesNavigationBookOffer,
      linking: { path: 'cheatcodes/book-offer' },
      options: { title: 'Cheatcodes - Réservation d’offre' },
    },
    CheatcodesNavigationBonification: {
      screen: CheatcodesNavigationBonification,
      linking: { path: 'cheatcodes/bonification' },
      options: { title: 'Cheatcodes - Bonification' },
    },
    CheatcodesNavigationCulturalSurvey: {
      screen: withAsyncErrorBoundary(CheatcodesNavigationCulturalSurvey),
      linking: { path: 'cheatcodes/cultural-survey' },
      options: { title: 'Cheatcodes - Questionnaire culturel' },
    },
    CheatcodesNavigationHome: {
      screen: CheatcodesNavigationHome,
      linking: { path: 'cheatcodes/home' },
      options: { title: 'Cheatcodes - Accueil' },
    },
    CheatcodesNavigationIdentityCheck: {
      screen: withAsyncErrorBoundary(CheatcodesNavigationIdentityCheck),
      linking: { path: 'cheatcodes/identity-check' },
      options: { title: 'Cheatcodes - Vérification d’identité' },
    },
    CheatcodesNavigationInternal: {
      screen: CheatcodesNavigationInternal,
      linking: { path: 'cheatcodes/internal' },
      options: { title: 'Cheatcodes - Interne' },
    },
    CheatcodesNavigationNewIdentificationFlow: {
      screen: withAsyncErrorBoundary(CheatcodesNavigationNewIdentificationFlow),
      linking: { path: 'cheatcodes/identity-check/new-identification-flow' },
      options: { title: 'Cheatcodes - Nouveau parcours d’identification' },
    },
    CheatcodesNavigationOnboarding: {
      screen: CheatcodesNavigationOnboarding,
      linking: { path: 'cheatcodes/onboarding' },
      options: { title: 'Cheatcodes - Onboarding' },
    },
    CheatcodesNavigationProfile: {
      screen: CheatcodesNavigationProfile,
      linking: { path: 'cheatcodes/profile' },
      options: { title: 'Cheatcodes - Profil' },
    },
    CheatcodesNavigationReviewInApp: {
      screen: CheatcodesNavigationReviewInApp,
      linking: { path: 'cheatcodes/review-in-app' },
      options: { title: 'Cheatcodes - Avis in-app' },
    },
    CheatcodesNavigationShare: {
      screen: CheatcodesNavigationShare,
      linking: { path: 'cheatcodes/share' },
      options: { title: 'Cheatcodes - Partage' },
    },
    CheatcodesNavigationSubscription: {
      screen: CheatcodesNavigationSubscription,
      linking: { path: 'cheatcodes/subscription' },
      options: { title: 'Cheatcodes - Abonnement' },
    },
    CheatcodesNavigationTrustedDevice: {
      screen: CheatcodesNavigationTrustedDevice,
      linking: { path: 'cheatcodes/trusted-device' },
      options: { title: 'Cheatcodes - Appareil de confiance' },
    },
    CheatcodesScreenBookingNotFound: {
      screen: CheatcodesScreenBookingNotFound,
      linking: { path: 'cheatcodes/bookings/booking-not-found' },
      options: { title: 'Cheatcodes - Réservation introuvable' },
    },
    CheatcodesScreenCategoryThematicHomeHeader: {
      screen: CheatcodesScreenCategoryThematicHomeHeader,
      linking: { path: 'cheatcodes/home/category-thematic-home-header' },
      options: { title: 'Cheatcodes - Header thématique (Catégorie)' },
    },
    CheatcodesScreenCinemaScreeningCardList: {
      screen: CheatcodesScreenCinemaScreeningCardList,
      linking: { path: 'cheatcodes/offer/cinema-screening-card-list' },
      options: { title: 'Cheatcodes - Tuiles séances cinéma' },
    },
    CheatcodesScreenDefaultThematicHomeHeader: {
      screen: withAsyncErrorBoundary(CheatcodesScreenDefaultThematicHomeHeader),
      linking: { path: 'cheatcodes/home/default-thematic-home-header' },
      options: { title: 'Cheatcodes - Header thématique (Défaut)' },
    },
    CheatcodesScreenHighlightThematicHomeHeader: {
      screen: CheatcodesScreenHighlightThematicHomeHeader,
      linking: { path: 'cheatcodes/home/highlight-thematic-home-header' },
      options: { title: 'Cheatcodes - Header thématique (Mise en avant)' },
    },
    CheatcodesScreenMaintenance: {
      screen: CheatcodesScreenMaintenance,
      linking: { path: 'cheatcodes/maintenance' },
      options: { title: 'Cheatcodes - Maintenance' },
    },
    CheatcodesScreenOffline: {
      screen: CheatcodesScreenOffline,
      linking: { path: 'cheatcodes/offline' },
      options: { title: 'Cheatcodes - Hors connexion' },
    },
    CheatcodesScreenNotEligibleEduConnect: {
      screen: CheatcodesScreenNotEligibleEduConnect,
      linking: { path: 'cheatcodes/identity-check/not-eligible-educonnect' },
      options: { title: 'Cheatcodes - EduConnect non éligible' },
    },
    CheatcodesScreenTrustedDeviceInfos: {
      screen: CheatcodesScreenTrustedDeviceInfos,
      linking: { path: 'cheatcodes/trusted-device/trusted-device-infos' },
      options: { title: 'Cheatcodes - Informations appareil de confiance' },
    },
    CheatcodesScreenRemoteBanners: {
      screen: CheatcodesScreenRemoteBanners,
      linking: { path: 'cheatcodes/remote-banners' },
      options: { title: 'Cheatcodes - Bannières distantes' },
    },
    /**** OTHER ****/
    CheatcodesNavigationErrors: {
      screen: withAsyncErrorBoundary(CheatcodesNavigationErrors),
      linking: { path: 'cheatcodes/other/errors' },
      options: { title: 'Cheatcodes - Erreurs' },
    },
    CheatcodesNavigationForceUpdate: {
      screen: CheatcodesNavigationForceUpdate,
      linking: { path: 'cheatcodes/other/force-update' },
      options: { title: 'Cheatcodes - Mise à jour forcée' },
    },
    CheatcodesNavigationGenericPages: {
      screen: CheatcodesNavigationGenericPages,
      linking: { path: 'cheatcodes/other/generic-pages' },
      options: { title: 'Cheatcodes - Pages génériques' },
    },
    CheatcodesNavigationModals: {
      screen: CheatcodesNavigationModals,
      linking: { path: 'cheatcodes/other/modals' },
      options: { title: 'Cheatcodes - Pages génériques' },
    },
    CheatcodesNavigationAccountManagement: {
      screen: withAsyncErrorBoundary(CheatcodesNavigationAccountManagement),
      linking: { path: 'cheatcodes/other/account-management' },
      options: { title: 'Cheatcodes - Gestion du compte' },
    },
    CheatcodesNavigationNotScreensPages: {
      screen: withAsyncErrorBoundary(CheatcodesNavigationNotScreensPages),
      linking: { path: 'cheatcodes/other/not-screens-pages' },
      options: { title: 'Cheatcodes - Pages non-écran' },
    },
    CheatcodeScreenLoadingPage: {
      screen: LoadingPage,
      linking: { path: 'cheatcodes/other/loading-page' },
      options: { title: 'Cheatcodes - Chargement' },
    },
    CheatcodesNavigationSignUp: {
      screen: withAsyncErrorBoundary(CheatcodesNavigationSignUp),
      linking: { path: 'cheatcodes/other/sign-up' },
      options: { title: 'Cheatcodes - Inscription' },
    },
    CheatcodesScreenAccesLibre: {
      screen: CheatcodesScreenAccesLibre,
      linking: { path: 'cheatcodes/other/acces-libre' },
      options: { title: 'Cheatcodes - Accès libre' },
    },
    CheatcodesScreenLastLoginInfo: {
      screen: CheatcodesScreenLastLoginInfo,
      linking: { path: 'cheatcodes/other/last-login-info' },
      options: { title: 'Cheatcodes - Informations de connexion' },
    },
    CheatcodesScreenAnalyticsDebugger: {
      screen: CheatcodesScreenAnalyticsDebugger,
      linking: {
        path: 'cheatcodes/other/analytics-debugger',
      },
    },
    CheatcodesScreenDebugInformations: {
      screen: CheatcodesScreenDebugInformations,
      linking: { path: 'cheatcodes/other/debug-informations' },
      options: { title: 'Cheatcodes - Informations de débogage' },
    },
    CheatcodesScreenFeatureFlags: {
      screen: CheatcodesScreenFeatureFlags,
      linking: { path: 'cheatcodes/other/feature-flags' },
      options: { title: 'Cheatcodes - Feature flags' },
    },
    CheatcodesScreenGenericErrorPage: {
      screen: CheatcodesScreenGenericErrorPage,
      linking: { path: 'cheatcodes/other/generic-error-page' },
      options: { title: 'Cheatcodes - Page d’erreur générique' },
    },
    CheatcodesScreenGenericInfoPage: {
      screen: CheatcodesScreenGenericInfoPage,
      linking: { path: 'cheatcodes/other/generic-info-page' },
      options: { title: 'Cheatcodes - Page d’information générique' },
    },
    CheatcodesScreenGenericInfoPageIllustrations: {
      screen: CheatcodesScreenGenericInfoPageIllustrations,
      linking: { path: 'cheatcodes/other/generic-info-page-illustrations' },
      options: { title: 'Cheatcodes - Illustrations des pages d’information' },
    },
    CheatcodesScreenGenericOfficialPage: {
      screen: CheatcodesScreenGenericOfficialPage,
      linking: { path: 'cheatcodes/other/generic-official-page' },
      options: { title: 'Cheatcodes - Page officielle' },
    },
    CheatcodesScreenLayoutExpiredLink: {
      screen: CheatcodesScreenLayoutExpiredLink,
      linking: { path: 'cheatcodes/other/layout-expired-link' },
      options: { title: 'Cheatcodes - Lien expiré' },
    },
    CheatcodesScreenMandatoryUpdate: {
      screen: CheatcodesScreenMandatoryUpdate,
      linking: { path: 'cheatcodes/other/campagne-mise-a-jour-données' },
      options: { title: 'Cheatcodes - Campagne de mise à jour des données' },
    },
    CheatcodesScreenModalSimpleNotScrollable: {
      screen: CheatcodesScreenModalSimpleNotScrollable,
      linking: { path: 'cheatcodes/other/modal-simple-not-scrollable' },
      options: {
        title: 'Cheatcodes - Modal simple not scrollable',
        ...modalType,
      },
    },
    CheatcodesScreenModalDetailed: {
      screen: CheatcodesScreenModalDetailed,
      linking: { path: 'cheatcodes/other/modal-detailed' },
      options: {
        title: 'Cheatcodes - Modal detailed',
        ...modalType,
      },
    },
    CheatcodesScreenCinemaScreeningDetailsModal: {
      screen: CheatcodesScreenCinemaScreeningDetailsModal,
      linking: { path: 'cheatcodes/other/cinema-screening-details-modal' },
      options: {
        title: 'Cheatcodes - Informations sur la séance',
        ...modalType,
      },
    },
    CheatcodesScreenModalSimpleScrollable: {
      screen: CheatcodesScreenModalSimpleScrollable,
      linking: { path: 'cheatcodes/other/modal-simple-scrollable' },
      options: {
        title: 'Cheatcodes - Modal simple scrollable',
        ...modalType,
      },
    },
    CheatcodesScreenNewCaledonia: {
      screen: CheatcodesScreenNewCaledonia,
      linking: { path: 'cheatcodes/other/new-caledonia' },
      options: { title: 'Cheatcodes - Nouvelle-Calédonie' },
    },
    CheatcodesScreenPageWithHeader: {
      screen: CheatcodesScreenPageWithHeader,
      linking: { path: 'cheatcodes/other/page-with-header' },
      options: { title: 'Cheatcodes - Page avec header' },
    },
    CheatcodesScreenRemoteConfig: {
      screen: CheatcodesScreenRemoteConfig,
      linking: { path: 'cheatcodes/other/remote-config' },
      options: { title: 'Cheatcodes - Remote Config' },
    },
    CheatcodesScreenPageHeaderWithoutPlaceholder: {
      screen: CheatcodesScreenPageHeaderWithoutPlaceholder,
      linking: { path: 'cheatcodes/other/page-header-without-placeholder' },
      options: { title: 'Cheatcodes - Header sans placeholder' },
    },
    CheatcodesScreenABTest: {
      screen: CheatcodesScreenABTest,
      linking: { path: 'cheatcodes/other/ab-test' },
      options: { title: 'Cheatcodes - A/B Test' },
    },
    CheatcodesScreenDirectIdAccess: {
      screen: CheatcodesScreenDirectIdAccess,
      linking: { path: 'cheatcodes/other/direct-id-access' },
      options: { title: 'Cheatcodes - Accès direct par ID' },
    },
  },
}

export const CheatcodesStackNavigator = createNativeStackNavigator(
  cheatcodesStackNavigatorPathDefinition
)

const CheatcodesScreen = createComponentForStaticNavigation(CheatcodesStackNavigator)

export default CheatcodesScreen
