import { TabBar } from '../../features/navigation/TabBar'
import ConsentSettingsScreen from '../../features/profile/ConsentSettingsScreen'
import NotificationScreen from '../../features/profile/NotificationScreen'
import ProfileScreen from '../../features/profile/ProfileScreen'
import { didFirstLaunch } from '../../helpers/utils/error'
import { scrollToBottom } from '../../helpers/utils/scrollToBottom'
import { DefaultTheme, getTheme } from '../../helpers/utils/theme'

describe('Profile', () => {
  let ok = true
  let tabBar: TabBar
  let theme: DefaultTheme

  before(async () => {
    theme = getTheme(await browser.getWindowSize())
    tabBar = new TabBar(theme)
  })

  it('should click on profile', async () => {
    didFirstLaunch(ok)
    await tabBar.profil.click()
  })

  describe('Offline', () => {
    describe('Notification', () => {
      it('should display a disabled "Autoriser les notifications marketing" button', async () => {
        await ProfileScreen.waitForIsShown()
        await ProfileScreen.notificationsLink.click()
        await NotificationScreen.marketingToggle.waitForDisplayed()
        expect(await NotificationScreen.marketingToggle.isEnabled()).toEqual(false)
      })

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
        expect(await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('value')).toEqual(
          'checkbox, checked'
        )
        expect(
          await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('value')
        ).toEqual('checkbox, checked')
        expect(await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('value')).toEqual(
          'checkbox, checked'
        )
        expect(
          await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('value')
        ).toEqual('checkbox, checked')
      })

      it('should deactivate all toggle when pressing "Tout accepter" activated toggle', async () => {
        await ConsentSettingsScreen.acceptEverythingToggle.click()

        expect(
          await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('value')
        ).toEqual('checkbox, not checked')
        expect(await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('value')).toEqual(
          'checkbox, not checked'
        )
        expect(
          await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('value')
        ).toEqual('checkbox, not checked')
      })

      it('should activate all toggle when pressing "Tout accepter" deactivated toggle', async () => {
        await ConsentSettingsScreen.acceptEverythingToggle.click()

        expect(
          await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('value')
        ).toEqual('checkbox, checked')
        expect(await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('value')).toEqual(
          'checkbox, checked'
        )
        expect(
          await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('value')
        ).toEqual('checkbox, checked')
      })

      it('should deactivate "Personnaliser ta navigation" and "Tout accepter" toggles when pressing "Personnaliser ta navigation" activated toggle', async () => {
        await ConsentSettingsScreen.personalizeYourNavigationToggle.click()

        expect(
          await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('value')
        ).toEqual('checkbox, not checked')
        expect(await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('value')).toEqual(
          'checkbox, not checked'
        )
      })

      it('should activate "Personnaliser ta navigation" toggle when pressing "Personnaliser ta navigation" deactivated toggle', async () => {
        await ConsentSettingsScreen.personalizeYourNavigationToggle.click()

        expect(
          await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('value')
        ).toEqual('checkbox, checked')
        expect(
          await ConsentSettingsScreen.personalizeYourNavigationToggle.getAttribute('checked')
        ).toBeTruthy()
      })

      it('should deactivate "Enregistrer des statistiques de navigation" and "Tout accepter" toggles when pressing "Enregistrer des statistiques de navigation" activated toggle', async () => {
        await ConsentSettingsScreen.saveNavigationStatsToggle.click()

        expect(await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('value')).toEqual(
          'checkbox, not checked'
        )
        expect(await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('value')).toEqual(
          'checkbox, not checked'
        )
      })

      it('should activate "Enregistrer des statistiques de navigation" toggle when pressing "Enregistrer des statistiques de navigation" deactivated toggle', async () => {
        await ConsentSettingsScreen.saveNavigationStatsToggle.click()

        expect(await ConsentSettingsScreen.saveNavigationStatsToggle.getAttribute('value')).toEqual(
          'checkbox, checked'
        )
      })

      it('should deactivate "Mesurer l’efficacité de nos publicités" and "Tout accepter" toggles when pressing "Mesurer l’efficacité de nos publicités" activated toggle', async () => {
        await ConsentSettingsScreen.measureProductsEffectivenessToggle.click()

        expect(
          await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('value')
        ).toEqual('checkbox, not checked')
        expect(await ConsentSettingsScreen.acceptEverythingToggle.getAttribute('value')).toEqual(
          'checkbox, not checked'
        )
      })

      it('should activate "Mesurer l’efficacité de nos publicités" toggle when pressing "Mesurer l’efficacité de nos publicités" deactivated toggle', async () => {
        await ConsentSettingsScreen.measureProductsEffectivenessToggle.click()

        expect(
          await ConsentSettingsScreen.measureProductsEffectivenessToggle.getAttribute('value')
        ).toEqual('checkbox, checked')
      })
    })
  })
})
