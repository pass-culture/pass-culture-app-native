import { createComponentForStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

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
import { CheatcodesNavigationOnboarding } from 'cheatcodes/pages/features/onboarding/CheatcodesNavigationOnboarding'
import { CheatcodesNavigationProfile } from 'cheatcodes/pages/features/profile/CheatcodesNavigationProfile'
import { CheatcodesScreenRemoteBanners } from 'cheatcodes/pages/features/remoteBanners/CheatcodesScreenRemoteBanners'
import { CheatcodesNavigationShare } from 'cheatcodes/pages/features/share/CheatcodesNavigationShare'
import { CheatcodesNavigationSubscription } from 'cheatcodes/pages/features/subscription/CheatcodesNavigationSubscription'
import { CheatcodesNavigationTrustedDevice } from 'cheatcodes/pages/features/trustedDevice/CheatcodesNavigationTrustedDevice'
import { CheatcodesScreenTrustedDeviceInfos } from 'cheatcodes/pages/features/trustedDevice/CheatcodesScreenTrustedDeviceInfos'
import { CheatcodesNavigationAccountManagement } from 'cheatcodes/pages/others/CheatcodesNavigationAccountManagement'
import { CheatcodesNavigationErrors } from 'cheatcodes/pages/others/CheatcodesNavigationErrors'
import { CheatcodesNavigationGenericPages } from 'cheatcodes/pages/others/CheatcodesNavigationGenericPages'
import { CheatcodesNavigationNotScreensPages } from 'cheatcodes/pages/others/CheatcodesNavigationNotScreensPages'
import { CheatcodesNavigationSignUp } from 'cheatcodes/pages/others/CheatcodesNavigationSignUp'
import { CheatcodesScreenAccesLibre } from 'cheatcodes/pages/others/CheatcodesScreenAccesLibre'
import { CheatcodesScreenDebugInformations } from 'cheatcodes/pages/others/CheatcodesScreenDebugInformations'
import { CheatcodesScreenFeatureFlags } from 'cheatcodes/pages/others/CheatcodesScreenFeatureFlags'
import { CheatcodesScreenGenericErrorPage } from 'cheatcodes/pages/others/CheatcodesScreenGenericErrorPage'
import { CheatcodesScreenGenericInfoPage } from 'cheatcodes/pages/others/CheatcodesScreenGenericInfoPage'
import { CheatcodesScreenGenericOfficialPage } from 'cheatcodes/pages/others/CheatcodesScreenGenericOfficialPage'
import { CheatcodesScreenLayoutExpiredLink } from 'cheatcodes/pages/others/CheatcodesScreenLayoutExpiredLink'
import { CheatcodesScreenMandatoryUpdate } from 'cheatcodes/pages/others/CheatcodesScreenMandatoryUpdate'
import { CheatcodesScreenNewCaledonia } from 'cheatcodes/pages/others/CheatcodesScreenNewCaledonia'
import { CheatcodesScreenPageWithHeader } from 'cheatcodes/pages/others/CheatcodesScreenPageWithHeader'
import { CheatcodesScreenRemoteConfig } from 'cheatcodes/pages/others/CheatcodesScreenRemoteConfig'
import { CheatcodesScreenSecondaryPageWithBlurHeader } from 'cheatcodes/pages/others/CheatcodesScreenSecondaryPageWithBlurHeader'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { LoadingPage } from 'ui/pages/LoadingPage'

const cheatcodesStackNavigatorPathDefinition = {
  screenOptions: {
    headerShown: false,
  },
  screens: {
    /**** MENU ****/
    CheatcodesMenu: {
      screen: CheatcodesMenu,
      linking: {
        path: 'cheatcodes',
      },
    },
    /**** FEATURES ****/
    CheatcodesNavigationAchievements: {
      screen: CheatcodesNavigationAchievements,
      linking: {
        path: 'cheatcodes/achievements',
      },
    },
    CheatcodesNavigationBirthdayNotifications: {
      screen: CheatcodesNavigationBirthdayNotifications,
      linking: {
        path: 'cheatcodes/birthday-notifications',
      },
    },
    CheatcodesNavigationBookings: {
      screen: CheatcodesNavigationBookings,
      linking: {
        path: 'cheatcodes/bookings',
      },
    },
    CheatcodesNavigationBookOffer: {
      screen: CheatcodesNavigationBookOffer,
      linking: {
        path: 'cheatcodes/book-offer',
      },
    },
    CheatcodesNavigationBonification: {
      screen: CheatcodesNavigationBonification,
      linking: {
        path: 'cheatcodes/bonification',
      },
    },
    CheatcodesNavigationCulturalSurvey: {
      screen: withAsyncErrorBoundary(CheatcodesNavigationCulturalSurvey),
      linking: {
        path: 'cheatcodes/cultural-survey',
      },
    },
    CheatcodesNavigationHome: {
      screen: CheatcodesNavigationHome,
      linking: {
        path: 'cheatcodes/home',
      },
    },
    CheatcodesNavigationIdentityCheck: {
      screen: withAsyncErrorBoundary(CheatcodesNavigationIdentityCheck),
      linking: {
        path: 'cheatcodes/identity-check',
      },
    },
    CheatcodesNavigationInternal: {
      screen: CheatcodesNavigationInternal,
      linking: {
        path: 'cheatcodes/internal',
      },
    },
    CheatcodesNavigationNewIdentificationFlow: {
      screen: withAsyncErrorBoundary(CheatcodesNavigationNewIdentificationFlow),
      linking: {
        path: 'cheatcodes/identity-check/new-identification-flow',
      },
    },
    CheatcodesNavigationOnboarding: {
      screen: CheatcodesNavigationOnboarding,
      linking: {
        path: 'cheatcodes/onboarding',
      },
    },
    CheatcodesNavigationProfile: {
      screen: CheatcodesNavigationProfile,
      linking: {
        path: 'cheatcodes/profile',
      },
    },
    // CheatcodesNavigationProfileTutorial: {
    //   linking: {
    //     path: 'cheatcodes/tutorial/profile-tutorial',
    //   },
    //   // screen: CheatcodesNavigationProfileTutorial,
    // },
    CheatcodesNavigationShare: {
      screen: CheatcodesNavigationShare,
      linking: {
        path: 'cheatcodes/share',
      },
    },
    CheatcodesNavigationSubscription: {
      screen: CheatcodesNavigationSubscription,
      linking: {
        path: 'cheatcodes/subscription',
      },
    },
    CheatcodesNavigationTrustedDevice: {
      screen: CheatcodesNavigationTrustedDevice,
      linking: {
        path: 'cheatcodes/trusted-device',
      },
    },
    // CheatcodesNavigationTutorial: {
    //   linking: {
    //     path: 'cheatcodes/tutorial',
    //   },
    //   // screen: CheatcodesNavigationTutorial,
    // },
    CheatcodesScreenBookingNotFound: {
      screen: CheatcodesScreenBookingNotFound,
      linking: {
        path: 'cheatcodes/bookings/booking-not-found',
      },
    },
    CheatcodesScreenCategoryThematicHomeHeader: {
      screen: CheatcodesScreenCategoryThematicHomeHeader,
      linking: {
        path: 'cheatcodes/home/category-thematic-home-header',
      },
    },
    CheatcodesScreenDefaultThematicHomeHeader: {
      screen: withAsyncErrorBoundary(CheatcodesScreenDefaultThematicHomeHeader),
      linking: {
        path: 'cheatcodes/home/default-thematic-home-header',
      },
    },
    CheatcodesScreenHighlightThematicHomeHeader: {
      screen: CheatcodesScreenHighlightThematicHomeHeader,
      linking: {
        path: 'cheatcodes/home/highlight-thematic-home-header',
      },
    },
    CheatcodesScreenMaintenance: {
      screen: CheatcodesScreenMaintenance,
      linking: {
        path: 'cheatcodes/maintenance',
      },
    },
    CheatcodesScreenNotEligibleEduConnect: {
      screen: CheatcodesScreenNotEligibleEduConnect,
      linking: {
        path: 'cheatcodes/identity-check/not-eligible-educonnect',
      },
    },
    CheatcodesScreenTrustedDeviceInfos: {
      screen: CheatcodesScreenTrustedDeviceInfos,
      linking: {
        path: 'cheatcodes/trusted-device/trusted-device-infos',
      },
    },
    CheatcodesScreenRemoteBanners: {
      screen: CheatcodesScreenRemoteBanners,
      linking: {
        path: 'cheatcodes/remote-banners',
      },
    },
    /**** OTHER ****/
    CheatcodesNavigationErrors: {
      screen: withAsyncErrorBoundary(CheatcodesNavigationErrors),
      linking: {
        path: 'cheatcodes/other/errors',
      },
    },
    CheatcodesNavigationForceUpdate: {
      screen: CheatcodesNavigationForceUpdate,
      linking: {
        path: 'cheatcodes/other/force-update',
      },
    },
    CheatcodesNavigationGenericPages: {
      screen: CheatcodesNavigationGenericPages,
      linking: {
        path: 'cheatcodes/other/generic-pages',
      },
    },
    CheatcodesNavigationAccountManagement: {
      screen: withAsyncErrorBoundary(CheatcodesNavigationAccountManagement),
      linking: {
        path: 'cheatcodes/other/account-management',
      },
    },
    CheatcodesNavigationNotScreensPages: {
      screen: withAsyncErrorBoundary(CheatcodesNavigationNotScreensPages),
      linking: {
        path: 'cheatcodes/other/not-screens-pages',
      },
    },
    CheatcodeScreenLoadingPage: {
      screen: LoadingPage,
      linking: {
        path: 'cheatcodes/other/loading-page',
      },
    },
    CheatcodesNavigationSignUp: {
      screen: withAsyncErrorBoundary(CheatcodesNavigationSignUp),
      linking: {
        path: 'cheatcodes/other/sign-up',
      },
    },
    CheatcodesScreenAccesLibre: {
      screen: CheatcodesScreenAccesLibre,
      linking: {
        path: 'cheatcodes/other/acces-libre',
      },
    },
    CheatcodesScreenDebugInformations: {
      screen: CheatcodesScreenDebugInformations,
      linking: {
        path: 'cheatcodes/other/debug-informations',
      },
    },
    CheatcodesScreenFeatureFlags: {
      screen: CheatcodesScreenFeatureFlags,
      linking: {
        path: 'cheatcodes/other/feature-flags',
      },
    },
    CheatcodesScreenGenericErrorPage: {
      screen: CheatcodesScreenGenericErrorPage,
      linking: {
        path: 'cheatcodes/other/generic-error-page',
      },
    },
    CheatcodesScreenGenericInfoPage: {
      screen: CheatcodesScreenGenericInfoPage,
      linking: {
        path: 'cheatcodes/other/generic-info-page',
      },
    },
    CheatcodesScreenGenericOfficialPage: {
      screen: CheatcodesScreenGenericOfficialPage,
      linking: {
        path: 'cheatcodes/other/generic-official-page',
      },
    },
    CheatcodesScreenLayoutExpiredLink: {
      screen: CheatcodesScreenLayoutExpiredLink,
      linking: {
        path: 'cheatcodes/other/layout-expired-link',
      },
    },
    CheatcodesScreenMandatoryUpdate: {
      screen: CheatcodesScreenMandatoryUpdate,
      linking: {
        path: 'cheatcodes/other/campagne-mise-a-jour-données',
      },
    },
    CheatcodesScreenNewCaledonia: {
      screen: CheatcodesScreenNewCaledonia,
      linking: {
        path: 'cheatcodes/other/new-caledonia',
      },
    },
    CheatcodesScreenPageWithHeader: {
      screen: CheatcodesScreenPageWithHeader,
      linking: {
        path: 'cheatcodes/other/page-with-header',
      },
    },
    CheatcodesScreenRemoteConfig: {
      screen: CheatcodesScreenRemoteConfig,
      linking: {
        path: 'cheatcodes/other/remote-config',
      },
    },
    CheatcodesScreenSecondaryPageWithBlurHeader: {
      screen: CheatcodesScreenSecondaryPageWithBlurHeader,
      linking: {
        path: 'cheatcodes/other/secondary-page-with-blur-header',
      },
    },
  },
}

export const CheatcodesStackNavigator = createNativeStackNavigator(
  cheatcodesStackNavigatorPathDefinition
)

const CheatcodesScreen = createComponentForStaticNavigation(CheatcodesStackNavigator, 'Cheatcodes')

export default CheatcodesScreen
