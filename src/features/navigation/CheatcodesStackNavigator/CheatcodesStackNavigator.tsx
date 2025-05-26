import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { CheatcodesMenu } from 'cheatcodes/pages/CheatcodesMenu'
import { CheatcodesNavigationAchievements } from 'cheatcodes/pages/features/achievements/CheatcodesNavigationAchievements'
import { CheatcodesNavigationBirthdayNotifications } from 'cheatcodes/pages/features/birthdayNotifications/CheatcodesNavigationBirthdayNotifications'
import { CheatcodesNavigationBookings } from 'cheatcodes/pages/features/bookings/CheatcodesNavigationBookings'
import { CheatcodesScreenBookingNotFound } from 'cheatcodes/pages/features/bookings/CheatcodesScreenBookingNotFound'
import { CheatcodesNavigationBookOffer } from 'cheatcodes/pages/features/bookOffer/CheatcodesNavigationBookOffer'
import { CheatcodesNavigationCulturalSurvey } from 'cheatcodes/pages/features/culturalSurvey/CheatcodesNavigationCulturalSurvey'
import { CheatcodesNavigationForceUpdate } from 'cheatcodes/pages/features/forceUpdate/cheatcodesNavigationForceUpdate'
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
import { CheatcodesScreenNewCaledonia } from 'cheatcodes/pages/others/CheatcodesScreenNewCaledonia'
import { CheatcodesScreenPageWithHeader } from 'cheatcodes/pages/others/CheatcodesScreenPageWithHeader'
import { CheatcodesScreenRemoteConfig } from 'cheatcodes/pages/others/CheatcodesScreenRemoteConfig'
import { CheatcodesScreenSecondaryPageWithBlurHeader } from 'cheatcodes/pages/others/CheatcodesScreenSecondaryPageWithBlurHeader'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { CheatcodesStackParamList } from 'features/navigation/CheatcodesStackNavigator/types'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { GenericRoute } from 'features/navigation/RootNavigator/types'
import { LoadingPage } from 'ui/pages/LoadingPage'

type CheatcodesStackRoute = GenericRoute<CheatcodesStackParamList>

const routes: CheatcodesStackRoute[] = [
  /**** MENU ****/
  {
    name: 'CheatcodesMenu',
    component: CheatcodesMenu,
  },
  /**** FEATURES ****/
  {
    name: 'CheatcodesNavigationBirthdayNotifications',
    component: CheatcodesNavigationBirthdayNotifications,
  },
  {
    name: 'CheatcodesNavigationHome',
    component: CheatcodesNavigationHome,
  },
  {
    name: 'CheatcodesScreenCategoryThematicHomeHeader',
    component: CheatcodesScreenCategoryThematicHomeHeader,
  },
  {
    name: 'CheatcodesScreenDefaultThematicHomeHeader',
    component: withAsyncErrorBoundary(CheatcodesScreenDefaultThematicHomeHeader),
  },
  {
    name: 'CheatcodesScreenHighlightThematicHomeHeader',
    component: CheatcodesScreenHighlightThematicHomeHeader,
  },
  {
    name: 'CheatcodesNavigationProfile',
    component: CheatcodesNavigationProfile,
  },
  {
    name: 'CheatcodesNavigationAchievements',
    component: CheatcodesNavigationAchievements,
  },
  {
    name: 'CheatcodesNavigationShare',
    component: CheatcodesNavigationShare,
  },
  {
    name: 'CheatcodesNavigationSubscription',
    component: CheatcodesNavigationSubscription,
  },
  {
    name: 'CheatcodesNavigationCulturalSurvey',
    component: withAsyncErrorBoundary(CheatcodesNavigationCulturalSurvey),
  },
  {
    name: 'CheatcodesNavigationOnboarding',
    component: CheatcodesNavigationOnboarding,
  },
  {
    name: 'CheatcodesNavigationTrustedDevice',
    component: CheatcodesNavigationTrustedDevice,
  },
  {
    name: 'CheatcodesNavigationForceUpdate',
    component: CheatcodesNavigationForceUpdate,
  },
  {
    name: 'CheatcodesScreenTrustedDeviceInfos',
    component: CheatcodesScreenTrustedDeviceInfos,
  },
  {
    name: 'CheatcodesNavigationIdentityCheck',
    component: withAsyncErrorBoundary(CheatcodesNavigationIdentityCheck),
  },
  {
    name: 'CheatcodesNavigationNewIdentificationFlow',
    component: withAsyncErrorBoundary(CheatcodesNavigationNewIdentificationFlow),
  },
  {
    name: 'CheatcodesNavigationInternal',
    component: CheatcodesNavigationInternal,
  },
  {
    name: 'CheatcodesNavigationBookOffer',
    component: CheatcodesNavigationBookOffer,
  },
  {
    name: 'CheatcodesNavigationBookings',
    component: CheatcodesNavigationBookings,
  },
  /**** OTHER ****/
  {
    name: 'CheatcodesScreenDebugInformations',
    component: CheatcodesScreenDebugInformations,
  },
  {
    name: 'CheatcodesScreenFeatureFlags',
    component: CheatcodesScreenFeatureFlags,
  },
  {
    name: 'CheatcodeScreenLoadingPage',
    component: LoadingPage,
  },
  {
    name: 'CheatcodesScreenNewCaledonia',
    component: CheatcodesScreenNewCaledonia,
  },
  {
    name: 'CheatcodesScreenRemoteBanners',
    component: CheatcodesScreenRemoteBanners,
  },
  {
    name: 'CheatcodesScreenMaintenance',
    component: CheatcodesScreenMaintenance,
  },
  {
    name: 'CheatcodesScreenRemoteConfig',
    component: CheatcodesScreenRemoteConfig,
  },
  {
    name: 'CheatcodesNavigationErrors',
    component: withAsyncErrorBoundary(CheatcodesNavigationErrors),
  },
  {
    name: 'CheatcodesNavigationNotScreensPages',
    component: withAsyncErrorBoundary(CheatcodesNavigationNotScreensPages),
  },
  {
    name: 'CheatcodesScreenLayoutExpiredLink',
    component: CheatcodesScreenLayoutExpiredLink,
  },
  {
    name: 'CheatcodesScreenAccesLibre',
    component: CheatcodesScreenAccesLibre,
  },
  {
    name: 'CheatcodesNavigationSignUp',
    component: withAsyncErrorBoundary(CheatcodesNavigationSignUp),
  },
  {
    name: 'CheatcodesNavigationAccountManagement',
    component: withAsyncErrorBoundary(CheatcodesNavigationAccountManagement),
  },
  {
    name: 'CheatcodesNavigationGenericPages',
    component: CheatcodesNavigationGenericPages,
  },
  {
    name: 'CheatcodesScreenGenericInfoPage',
    component: CheatcodesScreenGenericInfoPage,
  },
  {
    name: 'CheatcodesScreenSecondaryPageWithBlurHeader',
    component: CheatcodesScreenSecondaryPageWithBlurHeader,
  },
  {
    name: 'CheatcodesScreenPageWithHeader',
    component: CheatcodesScreenPageWithHeader,
  },
  {
    name: 'CheatcodesScreenGenericErrorPage',
    component: CheatcodesScreenGenericErrorPage,
  },
  {
    name: 'CheatcodesScreenGenericOfficialPage',
    component: CheatcodesScreenGenericOfficialPage,
  },
  {
    name: 'CheatcodesScreenBookingNotFound',
    component: CheatcodesScreenBookingNotFound,
  },
  {
    name: 'CheatcodesScreenNotEligibleEduConnect',
    component: CheatcodesScreenNotEligibleEduConnect,
  },
]

const CheatcodesStack = createStackNavigator<CheatcodesStackParamList>()

export const CheatcodesStackNavigator = () => (
  <CheatcodesStack.Navigator screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
    {routes.map(({ name, component }) => (
      <CheatcodesStack.Screen name={name} key={name} component={component} />
    ))}
  </CheatcodesStack.Navigator>
)
