import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { CheatcodesMenu } from 'cheatcodes/pages/CheatcodesMenu'
import { CheatcodesNavigationAchievements } from 'cheatcodes/pages/features/achievements/CheatcodesNavigationAchievements'
import { CheatcodesNavigationBookOffer } from 'cheatcodes/pages/features/bookOffer/CheatcodesNavigationBookOffer'
import { CheatcodesNavigationCulturalSurvey } from 'cheatcodes/pages/features/culturalSurvey/CheatcodesNavigationCulturalSurvey'
import { CheatcodesNavigationForceUpdate } from 'cheatcodes/pages/features/forceUpdate/cheatcodesNavigationForceUpdate'
import { CheatcodesNavigationHome } from 'cheatcodes/pages/features/home/CheatcodesNavigationHome'
import { CheatcodesScreenCategoryThematicHomeHeader } from 'cheatcodes/pages/features/home/CheatcodesScreenCategoryThematicHomeHeader'
import { CheatcodesScreenDefaultThematicHomeHeader } from 'cheatcodes/pages/features/home/CheatcodesScreenDefaultThematicHomeHeader'
import { CheatcodesScreenHighlightThematicHomeHeader } from 'cheatcodes/pages/features/home/CheatcodesScreenHighlightThematicHomeHeader'
import { CheatcodesNavigationIdentityCheck } from 'cheatcodes/pages/features/identityCheck/CheatcodesNavigationIdentityCheck'
import { CheatcodesNavigationNewIdentificationFlow } from 'cheatcodes/pages/features/identityCheck/CheatcodesNavigationNewIdentificationFlow'
import { CheatcodesNavigationInternal } from 'cheatcodes/pages/features/internal/CheatcodesNavigationInternal'
import { CheatcodesNavigationProfile } from 'cheatcodes/pages/features/profile/CheatcodesNavigationProfile'
import { CheatcodesScreenRemoteBanner } from 'cheatcodes/pages/features/remoteBanner/CheatcodesScreenRemoteBanner'
import { CheatcodesNavigationShare } from 'cheatcodes/pages/features/share/CheatcodesNavigationShare'
import { CheatcodesNavigationSubscription } from 'cheatcodes/pages/features/subscription/CheatcodesNavigationSubscription'
import { CheatcodesNavigationTrustedDevice } from 'cheatcodes/pages/features/trustedDevice/CheatcodesNavigationTrustedDevice'
import { CheatcodesScreenTrustedDeviceInfos } from 'cheatcodes/pages/features/trustedDevice/CheatcodesScreenTrustedDeviceInfos'
import { CheatcodesNavigationOnboarding } from 'cheatcodes/pages/features/tutorial/CheatcodesNavigationOnboarding'
import { CheatcodesNavigationProfileTutorial } from 'cheatcodes/pages/features/tutorial/CheatcodesNavigationProfileTutorial'
import { CheatcodesNavigationTutorial } from 'cheatcodes/pages/features/tutorial/CheatcodesNavigationTutorial'
import { CheatcodesNavigationAccountManagement } from 'cheatcodes/pages/others/CheatcodesNavigationAccountManagement'
import { CheatcodesNavigationErrors } from 'cheatcodes/pages/others/CheatcodesNavigationErrors'
import { CheatcodesNavigationNotScreensPages } from 'cheatcodes/pages/others/CheatcodesNavigationNotScreensPages'
import { CheatcodesNavigationSignUp } from 'cheatcodes/pages/others/CheatcodesNavigationSignUp'
import { CheatcodesScreenAccesLibre } from 'cheatcodes/pages/others/CheatcodesScreenAccesLibre'
import { CheatcodesScreenDebugInformations } from 'cheatcodes/pages/others/CheatcodesScreenDebugInformations'
import { CheatcodesScreenFeatureFlags } from 'cheatcodes/pages/others/CheatcodesScreenFeatureFlags'
import { CheatcodesScreenNewCaledonia } from 'cheatcodes/pages/others/CheatcodesScreenNewCaledonia'
import { CheatcodesScreenRemoteConfig } from 'cheatcodes/pages/others/CheatcodesScreenRemoteConfig'
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
    name: 'CheatcodesNavigationTutorial',
    component: CheatcodesNavigationTutorial,
  },
  {
    name: 'CheatcodesNavigationOnboarding',
    component: CheatcodesNavigationOnboarding,
  },
  {
    name: 'CheatcodesNavigationProfileTutorial',
    component: CheatcodesNavigationProfileTutorial,
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
    name: 'CheatcodesScreenRemoteBanner',
    component: CheatcodesScreenRemoteBanner,
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
]

const CheatcodesStack = createStackNavigator<CheatcodesStackParamList>()

export const CheatcodesStackNavigator = () => (
  <CheatcodesStack.Navigator screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
    {routes.map(({ name, component }) => (
      <CheatcodesStack.Screen name={name} key={name} component={component} />
    ))}
  </CheatcodesStack.Navigator>
)
