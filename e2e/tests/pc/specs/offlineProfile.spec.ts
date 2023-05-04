import { TabBar } from '../features/navigation/TabBar'
import NotificationScreen from '../features/profile/NotificationScreen'
import AccessibilityDeclaration from '../features/profile/AccessibilityDeclaration'
import AccessibilityEngagement from '../features/profile/AccessibilityEngagement'
import AccessibilityActionPlan from '../features/profile/AccessibilityActionPlan'
import ProfileScreen from '../features/profile/ProfileScreen'
import { didFirstLaunch } from '../helpers/utils/error'
import { flags } from '../helpers/utils/platform'
import { DefaultTheme, getTheme } from '../helpers/utils/theme'
import RecommendedPaths from '../features/profile/RecommendedPaths'
import AccessibilityScreen from '../features/profile/AccessibilityScreen'
import FirstLaunch from '../helpers/FirstLaunch'
import ConsentSettingsScreen from '../features/profile/ConsentSettingsScreen'

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
    describe('Notification', () => {
      it('should display a disabled "Autoriser l’envoi d’e-mails" button', async () => {
        await ProfileScreen.notificationsLink.click()

        await NotificationScreen.waitForIsShown()
        if (flags.isWeb) {
          expect(
            await NotificationScreen.authorizeEmailToggle.getAttribute('aria-disabled')
          ).toEqual('true')
        } else {
          expect(await NotificationScreen.authorizeEmailToggle.isEnabled()).toEqual(false)
        }
      })

      it('should return on profile page when pressing go back button', async () => {
        await NotificationScreen.goBackButton.waitForDisplayed()
        await NotificationScreen.goBackButton.click()
        await NotificationScreen.waitForIsHidden()
        expect(await ProfileScreen.notificationsLink.waitForDisplayed()).toBeTruthy()
      })
    })

    describe('Accessibility', () => {
      it('should display Accessibility screen', async () => {
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
    })

    describe('Consent settings', () => {

      it('should display consent settings screen', async () => {
        await ProfileScreen.consentLink.click()
        await ConsentSettingsScreen.waitForIsShown()
      })

      it('should display all toggle activated by default', async () => {
        if (flags.isWeb) {
          expect(
            await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('aria-checked')
          ).toEqual('true')
          expect(
            await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('aria-checked')
          ).toEqual('true')
          expect(
            await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('aria-checked')
          ).toEqual('true')
          expect(
            await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('aria-checked')
          ).toEqual('true')
        } else {
          expect(await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('value')).toEqual('checkbox, checked')
          expect(await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('value')).toEqual('checkbox, checked')
          expect(await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('value')).toEqual('checkbox, checked')
          expect(await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('value')).toEqual('checkbox, checked')
        }
      })

      it('should deactivate all toggle when pressing "Tout accepter" activated toggle', async () => {
        await ConsentSettingsScreen.acceptEverythingToggle.click()
        if (flags.isWeb) {
          expect(
            await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('aria-checked')
          ).toEqual('false')
          expect(
            await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('aria-checked')
          ).toEqual('false')
          expect(
            await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('aria-checked')
          ).toEqual('false')
        } else {
          expect(await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('value')).toEqual('checkbox, not checked')
          expect(await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('value')).toEqual('checkbox, not checked')
          expect(await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('value')).toEqual('checkbox, not checked')
        }
      })

      it('should activate all toggle when pressing "Tout accepter" deactivated toggle', async () => {
        await ConsentSettingsScreen.acceptEverythingToggle.click()
        if (flags.isWeb) {
          expect(
            await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('aria-checked')
          ).toEqual('true')
          expect(
            await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('aria-checked')
          ).toEqual('true')
          expect(
            await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('aria-checked')
          ).toEqual('true')
        } else {
          expect(await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('value')).toEqual('checkbox, checked')
          expect(await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('value')).toEqual('checkbox, checked')
          expect(await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('value')).toEqual('checkbox, checked')
        }
      })

      it('should deactivate "Personnaliser ta navigation" and "Tout accepter" toggles when pressing "Personnaliser ta navigation" activated toggle', async () => {
        await ConsentSettingsScreen.personalizeYourNavigationToggle.click()
        if (flags.isWeb) {
          expect(
            await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('aria-checked')
          ).toEqual('false')
          expect(
            await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('aria-checked')
          ).toEqual('false')
        } else {
          expect(await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('value')).toEqual('checkbox, not checked')
          expect(await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('value')).toEqual('checkbox, not checked')
        }
      })

      it('should activate "Personnaliser ta navigation" toggle when pressing "Personnaliser ta navigation" deactivated toggle', async () => {
        await ConsentSettingsScreen.personalizeYourNavigationToggle.click()
        if (flags.isWeb) {
          expect(
            await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('aria-checked')
          ).toEqual('true')
        } else {
          expect(await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('value')).toEqual('checkbox, checked')
        }
      })

      it('should deactivate "Enregistrer des statistiques de navigation" and "Tout accepter" toggles when pressing "Enregistrer des statistiques de navigation" activated toggle', async () => {
        await ConsentSettingsScreen.saveNavigationStatsToggle.click()
        if (flags.isWeb) {
          expect(
            await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('aria-checked')
          ).toEqual('false')
          expect(
            await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('aria-checked')
          ).toEqual('false')
        } else {
          expect(await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('value')).toEqual('checkbox, not checked')
          expect(await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('value')).toEqual('checkbox, not checked')
        }
      })

      it('should activate "Enregistrer des statistiques de navigation" toggle when pressing "Enregistrer des statistiques de navigation" deactivated toggle', async () => {
        await ConsentSettingsScreen.saveNavigationStatsToggle.click()
        if (flags.isWeb) {
          expect(
            await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('aria-checked')
          ).toEqual('true')
        } else {
          expect(await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('value')).toEqual('checkbox, checked')
        }
      })

      it('should deactivate "Mesurer l’efficacité de nos publicités" and "Tout accepter" toggles when pressing "Mesurer l’efficacité de nos publicités" activated toggle', async () => {
        await ConsentSettingsScreen.measureProductsEffectivenessToggle.click()
        if (flags.isWeb) {
          expect(
            await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('aria-checked')
          ).toEqual('false')
          expect(
            await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('aria-checked')
          ).toEqual('false')
        } else {
          expect(await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('value')).toEqual('checkbox, not checked')
          expect(await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('value')).toEqual('checkbox, not checked')
        }
      })

      it('should activate "Mesurer l’efficacité de nos publicités" toggle when pressing "Mesurer l’efficacité de nos publicités" deactivated toggle', async () => {
        await ConsentSettingsScreen.measureProductsEffectivenessToggle.click()
        if (flags.isWeb) {
          expect(
            await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('aria-checked')
          ).toEqual('true')
        } else {
          expect(await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('value')).toEqual('checkbox, checked')
        }
      })

      it('should redirect to profile when pressing "Enregistrer mes choix" button', async () => {
        await ConsentSettingsScreen.saveChoicesButton.click()
        await ConsentSettingsScreen.waitForIsHidden()
        expect(await ProfileScreen.notificationsLink.waitForDisplayed()).toBeTruthy()
      })

      it('should display "Ton choix a bien été enregistré" snackbar', async () => {
        expect(await ProfileScreen.snackbarConsentSettings.waitForDisplayed()).toBeTruthy()
      })
    })
  })
})
