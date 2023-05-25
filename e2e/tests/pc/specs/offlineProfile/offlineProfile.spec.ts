import { TabBar } from '../../features/navigation/TabBar'
import AccessibilityDeclaration from '../../features/profile/AccessibilityDeclaration'
import AccessibilityEngagement from '../../features/profile/AccessibilityEngagement'
import AccessibilityActionPlan from '../../features/profile/AccessibilityActionPlan'
import ProfileScreen from '../../features/profile/ProfileScreen'
import { didFirstLaunch } from '../../helpers/utils/error'
import { DefaultTheme, getTheme } from '../../helpers/utils/theme'
import RecommendedPaths from '../../features/profile/RecommendedPaths'
import AccessibilityScreen from '../../features/profile/AccessibilityScreen'
import FirstLaunch from '../../helpers/FirstLaunch'
import ConsentSettingsScreen from '../../features/profile/ConsentSettingsScreen'
import { scrollToBottom } from '../../helpers/utils/scrollToBottom'
import { timeout } from '../../helpers/utils/time'
import LegalNoticesScreen from '../../features/profile/LegalNoticesScreen'

describe('Profile', () => {
  let ok = false
  let tabBar: TabBar
  let theme: DefaultTheme

  before(async () => {
    theme = getTheme(await browser.getWindowSize())
    tabBar = new TabBar(theme)
  })

  it('should first launch app', async () => {
    ok = await FirstLaunch.init(tabBar)
  })

  it('should click on profile', async () => {
    didFirstLaunch(ok)
    await tabBar.profil.click()
    await ProfileScreen.waitForIsShown()
  })

  describe('Offline', () => {
    describe('Accessibility', () => {
      it('should display Accessibility screen', async () => {
        await scrollToBottom(0.7)
        
        await ProfileScreen.accessibilityLink.click()
        await AccessibilityScreen.waitForIsShown()
      })

      it('should navigate to accessibility engagement and go back to Accessibility screen', async () => {
        await AccessibilityScreen.accessibilityEngagementLink.click()
        await AccessibilityEngagement.waitForIsShown()
        await AccessibilityEngagement.goBack.click()
        await AccessibilityScreen.waitForIsShown()
      })

      it('should navigate to recommended paths and go back to Accessibility screen', async () => {
        await AccessibilityScreen.recommendedPathsLink.click()
        await RecommendedPaths.waitForIsShown()
        await RecommendedPaths.goBack.click()
        await AccessibilityScreen.waitForIsShown()
      })

      it('should navigate to accessibility declaration and go back to Accessibility screen', async () => {
        await AccessibilityScreen.accessibilityDeclarationLink.click()
        await AccessibilityDeclaration.waitForIsShown()
        await AccessibilityDeclaration.goBack.click()
        await AccessibilityScreen.waitForIsShown()
      })

      it('should navigate to action plan and go back to Accessibility screen', async () => {
        await AccessibilityScreen.actionPlanLink.click()
        await AccessibilityActionPlan.waitForIsShown()
        await AccessibilityActionPlan.goBack.click()
        await AccessibilityScreen.waitForIsShown()
      })

      it('should go back to profile', async () => {
        await AccessibilityScreen.goBack.click()
        await ProfileScreen.waitForIsShown()
      })
    })

    describe('Legal notices', () => {
      it('should display legal notices screen', async () => {
        await scrollToBottom()

        await ProfileScreen.legalNoticesLink.click()
        await LegalNoticesScreen.waitForIsShown()
      })

      it('should go back to profile', async () => {
        await LegalNoticesScreen.goBack.click()
        await ProfileScreen.waitForIsShown()
      })
    })

    describe('Consent settings', () => {
      it('should display consent settings screen', async () => {
        await ProfileScreen.consentLink.click()
        await ConsentSettingsScreen.waitForIsShown()
      })

      // TODO(PC-22289): the test doesn't work on my Android emulator (iOS & web ok)
      it.skip('should display success snackbar and redirect to profile when pressing “Enregistrer mes choix” button', async () => {
        await scrollToBottom()

        await timeout(1000)
        await ConsentSettingsScreen.saveChoicesButton.click()

        await ProfileScreen.snackbarConsentSettings.waitForExist({ interval: 50 }) // The snackbar is a temporary element so we use waitForExist instead of waitForDisplayed, with a short interval.
        await ProfileScreen.waitForIsShown()
      })
    })
  })
})
