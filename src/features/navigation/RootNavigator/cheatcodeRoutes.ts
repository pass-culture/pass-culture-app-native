import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { AccesLibre } from 'features/internal/cheatcodes/pages/AccesLibre'
import { AppComponents } from 'features/internal/cheatcodes/pages/AppComponents/AppComponents'
import { CheatCodes } from 'features/internal/cheatcodes/pages/CheatCodes/CheatCodes'
import { CheatMenu } from 'features/internal/cheatcodes/pages/CheatMenu'
import { MarketingBlocks } from 'features/internal/cheatcodes/pages/MarketingBlocks'
import { Navigation } from 'features/internal/cheatcodes/pages/Navigation'
import { NavigationAccountSuspension } from 'features/internal/cheatcodes/pages/NavigationAccountSuspension'
import { NavigationAchievements } from 'features/internal/cheatcodes/pages/NavigationAchievements'
import { NavigationCulturalSurvey } from 'features/internal/cheatcodes/pages/NavigationCulturalSurvey/NavigationCulturalSurvey'
import { NavigationErrors } from 'features/internal/cheatcodes/pages/NavigationErrors/NavigationErrors'
import { NavigationNotScreensPages } from 'features/internal/cheatcodes/pages/NavigationNotScreensPages'
import { NavigationProfile } from 'features/internal/cheatcodes/pages/NavigationProfile'
import { NavigationShareApp } from 'features/internal/cheatcodes/pages/NavigationShareApp/NavigationShareApp'
import { NavigationSignUp } from 'features/internal/cheatcodes/pages/NavigationSignUp'
import { NavigationIdentityCheck } from 'features/internal/cheatcodes/pages/NavigationSignUp/NavigationIdentityCheck'
import { NewIdentificationFlow } from 'features/internal/cheatcodes/pages/NavigationSignUp/NavigationIdentityCheck/NewIdentificationFlow/NewIdentificationFlow'
import { NavigationSubscription } from 'features/internal/cheatcodes/pages/NavigationSubscription/NavigationSubscription'
import { NavigationTrustedDevice } from 'features/internal/cheatcodes/pages/NavigationTrustedDevice/NavigationTrustedDevice'
import { TrustedDeviceInfos } from 'features/internal/cheatcodes/pages/NavigationTrustedDevice/TrustedDeviceInfos'
import { NavigationOnboarding } from 'features/internal/cheatcodes/pages/NavigationTutorial/NavigationOnboarding'
import { NavigationProfileTutorial } from 'features/internal/cheatcodes/pages/NavigationTutorial/NavigationProfileTutorial'
import { NavigationTutorial } from 'features/internal/cheatcodes/pages/NavigationTutorial/NavigationTutorial'
import { NewCaledonia } from 'features/internal/cheatcodes/pages/NewCaledonia'
import { CategoryThematicHomeHeaderCheatcode } from 'features/internal/cheatcodes/pages/ThematicHomeHeaderCheatcode/CategoryThematicHomeHeaderCheatcode'
import { DefaultThematicHomeHeaderCheatcode } from 'features/internal/cheatcodes/pages/ThematicHomeHeaderCheatcode/DefaultThematicHomeHeaderCheatcode'
import { HighlightThematicHomeHeaderCheatcode } from 'features/internal/cheatcodes/pages/ThematicHomeHeaderCheatcode/HighlightThematicHomeHeaderCheatcode'
import { ThematicHeaders } from 'features/internal/cheatcodes/pages/ThematicHomeHeaderCheatcode/ThematicHeaders'
import { CheatcodeRootStackParamList, GenericRoute } from 'features/navigation/RootNavigator/types'

export const cheatcodeRoutes: GenericRoute<CheatcodeRootStackParamList>[] = [
  {
    name: 'AppComponents',
    component: AppComponents,
    path: 'composants-app',
  },
  {
    name: 'CheatCodes',
    component: CheatCodes,
    path: 'cheat-codes',
  },
  {
    name: 'CheatMenu',
    component: CheatMenu,
    path: 'cheat-menu',
  },
  {
    name: 'NavigationAccountSuspension',
    component: NavigationAccountSuspension,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-navigation-account-suspension',
  },
  {
    name: 'AccesLibre',
    component: AccesLibre,
    path: 'acces-libre',
  },
  {
    name: 'MarketingBlocks',
    component: MarketingBlocks,
    path: 'marketing-blocks',
  },
  {
    name: 'Navigation',
    component: Navigation,
    path: 'cheat-navigation',
  },
  {
    name: 'NavigationNotScreensPages',
    component: NavigationNotScreensPages,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-navigation-not-screens-pages',
  },
  {
    name: 'NavigationProfile',
    component: NavigationProfile,
    path: 'cheat-navigation-profile',
  },
  {
    name: 'NavigationAchievements',
    component: NavigationAchievements,
    path: 'cheat-navigation-achievements',
  },
  {
    name: 'NavigationShareApp',
    component: NavigationShareApp,
    path: 'cheat-navigation-share-app',
  },
  {
    name: 'NavigationSubscription',
    component: NavigationSubscription,
    path: 'cheat-navigation-subscription',
  },
  {
    name: 'NewCaledonia',
    component: NewCaledonia,
    path: 'nouvelle-caledonie',
  },
  {
    // debug route: in navigation component
    name: 'CategoryThematicHomeHeaderCheatcode',
    component: CategoryThematicHomeHeaderCheatcode,
    path: 'cheat-category-home-header',
  },
  {
    // debug route: in navigation component
    name: 'DefaultThematicHomeHeaderCheatcode',
    component: DefaultThematicHomeHeaderCheatcode,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-default-home-header',
  },
  {
    // debug route: in navigation component
    name: 'HighlightThematicHomeHeaderCheatcode',
    component: HighlightThematicHomeHeaderCheatcode,
    path: 'cheat-highlight-home-header',
  },
  {
    // debug route: in navigation component
    name: 'ThematicHeaders',
    component: ThematicHeaders,
    path: 'cheat-thematic-home-header',
  },
  {
    name: 'CheatcodeNavigationTutorial',
    component: NavigationTutorial,
    path: 'cheat-navigation-tutorial',
  },
  {
    name: 'CheatcodeNavigationOnboarding',
    component: NavigationOnboarding,
    path: 'cheat-navigation-onboarding',
  },
  {
    name: 'CheatcodeNavigationProfileTutorial',
    component: NavigationProfileTutorial,
    path: 'cheat-navigation-profile-tutorial',
  },
  {
    // debug route: in navigation component
    name: 'NavigationSignUp',
    component: NavigationSignUp,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-navigation-sign-up',
  },
  {
    // debug route: in navigation component
    name: 'NavigationErrors',
    component: NavigationErrors,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-navigation-errors',
  },
  {
    // debug route: in navigation component
    name: 'NavigationIdentityCheck',
    component: NavigationIdentityCheck,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-navigation-identity-check',
  },
  {
    // debug route: in navigation component
    name: 'NewIdentificationFlow',
    component: NewIdentificationFlow,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-navigation-new-identification-flow',
  },
  {
    name: 'NavigationCulturalSurvey',
    component: NavigationCulturalSurvey,
    hoc: withAsyncErrorBoundary,
    path: 'questionnaire-pratiques-initiales',
  },
  {
    name: 'NavigationTrustedDevice',
    component: NavigationTrustedDevice,
    path: 'appareil-de-confiance-navigation',
  },
  {
    name: 'TrustedDeviceInfos',
    component: TrustedDeviceInfos,
    path: 'appareil-de-confiance-cheatcode-informations',
    options: { title: 'Informations de l’appareil' },
  },
]
