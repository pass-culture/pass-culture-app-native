import { CheatcodesMenu } from 'cheatcodes/pages/CheatcodesMenu'
import { CheatcodesNavigationAchievements } from 'cheatcodes/pages/features/achievements/CheatcodesNavigationAchievements'
import { CheatcodesNavigationBookOffer } from 'cheatcodes/pages/features/bookOffer/CheatcodesNavigationBookOffer'
import { CheatcodesNavigationCulturalSurvey } from 'cheatcodes/pages/features/culturalSurvey/CheatcodesNavigationCulturalSurvey'
import { CheatcodesNavigationHome } from 'cheatcodes/pages/features/home/CheatcodesNavigationHome'
import { CheatcodesScreenCategoryThematicHomeHeader } from 'cheatcodes/pages/features/home/CheatcodesScreenCategoryThematicHomeHeader'
import { CheatcodesScreenDefaultThematicHomeHeader } from 'cheatcodes/pages/features/home/CheatcodesScreenDefaultThematicHomeHeader'
import { CheatcodesScreenHighlightThematicHomeHeader } from 'cheatcodes/pages/features/home/CheatcodesScreenHighlightThematicHomeHeader'
import { CheatcodesNavigationIdentityCheck } from 'cheatcodes/pages/features/identityCheck/CheatcodesNavigationIdentityCheck'
import { CheatcodesNavigationNewIdentificationFlow } from 'cheatcodes/pages/features/identityCheck/CheatcodesNavigationNewIdentificationFlow'
import { CheatcodesNavigationInternal } from 'cheatcodes/pages/features/internal/CheatcodesNavigationInternal'
import { CheatcodesNavigationAccountManagement } from 'cheatcodes/pages/features/other/CheatcodesNavigationAccountManagement'
import { CheatcodesNavigationErrors } from 'cheatcodes/pages/features/other/CheatcodesNavigationErrors'
import { CheatcodesNavigationNotScreensPages } from 'cheatcodes/pages/features/other/CheatcodesNavigationNotScreensPages'
import { CheatcodesNavigationSignUp } from 'cheatcodes/pages/features/other/CheatcodesNavigationSignUp'
import { CheatcodesScreenAccesLibre } from 'cheatcodes/pages/features/other/CheatcodesScreenAccesLibre'
import { CheatcodesScreenDebugInformations } from 'cheatcodes/pages/features/other/CheatcodesScreenDebugInformations'
import { CheatcodesScreenNewCaledonia } from 'cheatcodes/pages/features/other/CheatcodesScreenNewCaledonia'
import { CheatcodesNavigationProfile } from 'cheatcodes/pages/features/profile/CheatcodesNavigationProfile'
import { CheatcodesNavigationShare } from 'cheatcodes/pages/features/share/CheatcodesNavigationShare'
import { CheatcodesNavigationSubscription } from 'cheatcodes/pages/features/subscription/CheatcodesNavigationSubscription'
import { CheatcodesNavigationTrustedDevice } from 'cheatcodes/pages/features/trustedDevice/CheatcodesNavigationTrustedDevice'
import { CheatcodesScreenTrustedDeviceInfos } from 'cheatcodes/pages/features/trustedDevice/CheatcodesScreenTrustedDeviceInfos'
import { CheatcodesNavigationOnboarding } from 'cheatcodes/pages/features/tutorial/CheatcodesNavigationOnboarding'
import { CheatcodesNavigationProfileTutorial } from 'cheatcodes/pages/features/tutorial/CheatcodesNavigationProfileTutorial'
import { CheatcodesNavigationTutorial } from 'cheatcodes/pages/features/tutorial/CheatcodesNavigationTutorial'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { CheatcodeRootStackParamList, GenericRoute } from 'features/navigation/RootNavigator/types'

export const cheatcodesRoutes: GenericRoute<CheatcodeRootStackParamList>[] = [
  // *** MENU ***
  {
    name: 'CheatcodesMenu',
    component: CheatcodesMenu,
    path: 'cheatcodes',
  },
  // *** FEATURES ***
  {
    name: 'CheatcodesNavigationHome',
    component: CheatcodesNavigationHome,
    path: 'cheatcodes/home',
  },
  {
    name: 'CheatcodesScreenCategoryThematicHomeHeader',
    component: CheatcodesScreenCategoryThematicHomeHeader,
    path: 'cheatcodes/home/category-thematic-home-header',
  },
  {
    name: 'CheatcodesScreenDefaultThematicHomeHeader',
    component: CheatcodesScreenDefaultThematicHomeHeader,
    path: 'cheatcodes/home/default-thematic-home-header',
    hoc: withAsyncErrorBoundary,
  },
  {
    name: 'CheatcodesScreenHighlightThematicHomeHeader',
    component: CheatcodesScreenHighlightThematicHomeHeader,
    path: 'cheatcodes/home/highlight-thematic-home-header',
  },
  {
    name: 'CheatcodesNavigationProfile',
    component: CheatcodesNavigationProfile,
    path: 'cheatcodes/profile',
  },
  {
    name: 'CheatcodesNavigationAchievements',
    component: CheatcodesNavigationAchievements,
    path: 'cheatcodes/achievements',
  },
  {
    name: 'CheatcodesNavigationShare',
    component: CheatcodesNavigationShare,
    path: 'cheatcodes/share',
  },
  {
    name: 'CheatcodesNavigationSubscription',
    component: CheatcodesNavigationSubscription,
    path: 'cheatcodes/subscription',
  },
  {
    name: 'CheatcodesNavigationCulturalSurvey',
    component: CheatcodesNavigationCulturalSurvey,
    path: 'cheatcodes/cultural-survey',
    hoc: withAsyncErrorBoundary,
  },
  {
    name: 'CheatcodesNavigationTutorial',
    component: CheatcodesNavigationTutorial,
    path: 'cheatcodes/tutorial',
  },
  {
    name: 'CheatcodesNavigationOnboarding',
    component: CheatcodesNavigationOnboarding,
    path: 'cheatcodes/tutorial/onboarding',
  },
  {
    name: 'CheatcodesNavigationProfileTutorial',
    component: CheatcodesNavigationProfileTutorial,
    path: 'cheatcodes/tutorial/profile-tutorial',
  },
  {
    name: 'CheatcodesNavigationTrustedDevice',
    component: CheatcodesNavigationTrustedDevice,
    path: 'cheatcodes/trusted-device',
  },
  {
    name: 'CheatcodesScreenTrustedDeviceInfos',
    component: CheatcodesScreenTrustedDeviceInfos,
    path: 'cheatcodes/trusted-device/trusted-device-infos',
  },
  {
    name: 'CheatcodesNavigationIdentityCheck',
    component: CheatcodesNavigationIdentityCheck,
    path: 'cheatcodes/identity-check',
    hoc: withAsyncErrorBoundary,
  },
  {
    name: 'CheatcodesNavigationNewIdentificationFlow',
    component: CheatcodesNavigationNewIdentificationFlow,
    path: 'cheatcodes/identity-check/new-identification-flow',
    hoc: withAsyncErrorBoundary,
  },
  {
    name: 'CheatcodesNavigationInternal',
    component: CheatcodesNavigationInternal,
    path: 'cheatcodes/internal',
  },
  {
    name: 'CheatcodesNavigationBookOffer',
    component: CheatcodesNavigationBookOffer,
    path: 'cheatcodes/book-offer',
  },
  // *** OTHER ***
  {
    name: 'CheatcodesScreenDebugInformations',
    component: CheatcodesScreenDebugInformations,
    path: 'cheatcodes/other/debug-informations',
  },
  {
    name: 'CheatcodesScreenNewCaledonia',
    component: CheatcodesScreenNewCaledonia,
    path: 'cheatcodes/other/new-caledonia',
  },
  {
    name: 'CheatcodesNavigationErrors',
    component: CheatcodesNavigationErrors,
    hoc: withAsyncErrorBoundary,
    path: 'cheatcodes/other/errors',
  },
  {
    name: 'CheatcodesNavigationNotScreensPages',
    component: CheatcodesNavigationNotScreensPages,
    path: 'cheatcodes/other/not-screens-pages',
    hoc: withAsyncErrorBoundary,
  },
  {
    name: 'CheatcodesScreenAccesLibre',
    component: CheatcodesScreenAccesLibre,
    path: 'cheatcodes/other/acces-libre',
  },
  {
    name: 'CheatcodesNavigationSignUp',
    component: CheatcodesNavigationSignUp,
    hoc: withAsyncErrorBoundary,
    path: 'cheatcodes/other/sign-up',
  },
  {
    name: 'CheatcodesNavigationAccountManagement',
    component: CheatcodesNavigationAccountManagement,
    path: 'cheatcodes/other/account-management',
    hoc: withAsyncErrorBoundary,
  },
]
