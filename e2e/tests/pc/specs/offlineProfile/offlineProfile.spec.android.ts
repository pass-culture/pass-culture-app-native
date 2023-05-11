import { TabBar } from '../../features/navigation/TabBar'
import ProfileScreen from '../../features/profile/ProfileScreen'
import { didFirstLaunch } from '../../helpers/utils/error'
import { DefaultTheme, getTheme } from '../../helpers/utils/theme'
import FirstLaunch from '../../helpers/FirstLaunch'
import ConsentSettingsScreen from '../../features/profile/ConsentSettingsScreen'
import { scrollToBottom } from '../../helpers/utils/scrollToBottom'
import NotificationScreen from '../../features/profile/NotificationScreen'

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
        expect(await NotificationScreen.authorizeEmailToggle.isEnabled()).toBeFalsy()
      })

      it('should return on profile page when pressing go back button', async () => {
        await NotificationScreen.goBackButton.click()
        await ProfileScreen.waitForIsShown()
      })
    })

    describe('Consent settings', () => {
      it('should display consent settings screen', async () => {
        await scrollToBottom()
        await ProfileScreen.consentLink.click()
        await ConsentSettingsScreen.waitForIsShown()
      })

      it('should display all toggle activated by default', async () => {
        expect(
          await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('checked')
        ).toBeTruthy()
        expect(
          await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('checked')
        ).toBeTruthy()
        expect(
          await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('checked')
        ).toBeTruthy()
        expect(
          await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('checked')
        ).toBeTruthy()
      })

      it('should deactivate all toggle when pressing "Tout accepter" activated toggle', async () => {
        await ConsentSettingsScreen.acceptEverythingToggle.click()

        expect(
          await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('checked')
        ).toBeFalsy()
        expect(
          await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('checked')
        ).toBeFalsy()
        expect(
          await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('checked')
        ).toBeFalsy()
      })

      it('should activate all toggle when pressing "Tout accepter" deactivated toggle', async () => {
        await ConsentSettingsScreen.acceptEverythingToggle.click()

        expect(
          await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('checked')
        ).toBeTruthy()
        expect(
          await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('checked')
        ).toBeTruthy()
        expect(
          await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('checked')
        ).toBeTruthy()
      })

      it('should deactivate "Personnaliser ta navigation" and "Tout accepter" toggles when pressing "Personnaliser ta navigation" activated toggle', async () => {
        await ConsentSettingsScreen.personalizeYourNavigationToggle.click()

        expect(
          await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('checked')
        ).toBeFalsy()
        expect(
          await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('checked')
        ).toBeFalsy()
      })

      it('should activate "Personnaliser ta navigation" toggle when pressing "Personnaliser ta navigation" deactivated toggle', async () => {
        await ConsentSettingsScreen.personalizeYourNavigationToggle.click()

        expect(
          await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('checked')
        ).toBeTruthy()
      })

      it('should deactivate "Enregistrer des statistiques de navigation" and "Tout accepter" toggles when pressing "Enregistrer des statistiques de navigation" activated toggle', async () => {
        await ConsentSettingsScreen.saveNavigationStatsToggle.click()

        expect(
          await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('checked')
        ).toBeFalsy()
        expect(
          await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('checked')
        ).toBeFalsy()
      })

      it('should activate "Enregistrer des statistiques de navigation" toggle when pressing "Enregistrer des statistiques de navigation" deactivated toggle', async () => {
        await ConsentSettingsScreen.saveNavigationStatsToggle.click()

        expect(
          await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('checked')
        ).toBeTruthy()
      })

      it('should deactivate "Mesurer l’efficacité de nos publicités" and "Tout accepter" toggles when pressing "Mesurer l’efficacité de nos publicités" activated toggle', async () => {
        await ConsentSettingsScreen.measureProductsEffectivenessToggle.click()

        expect(
          await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('checked')
        ).toBeFalsy()
        expect(
          await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('checked')
        ).toBeFalsy()
      })

      it('should activate "Mesurer l’efficacité de nos publicités" toggle when pressing "Mesurer l’efficacité de nos publicités" deactivated toggle', async () => {
        await ConsentSettingsScreen.measureProductsEffectivenessToggle.click()

        expect(
          await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('checked')
        ).toBeTruthy()
      })
    })
  })
})
