import { TabBar } from '../features/navigation/TabBar'
import AccessibilityScreen from '../features/profile/AccessibilityScreen'
import NotificationScreen from '../features/profile/NotificationScreen'
import ProfileScreen from '../features/profile/ProfileScreen'
import FirstLaunch from '../helpers/FirstLaunch'
import { didFirstLaunch } from '../helpers/utils/error'
import { flags } from '../helpers/utils/platform'
import { DefaultTheme, getTheme } from '../helpers/utils/theme'

describe('Profile', () => {
  let ok = true
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
  })

  describe('Offline', () => {
    describe('Notification', () => {
      it('should display a disabled "Autoriser l’envoi d’e-mails" button', async () => {
        await ProfileScreen.waitForIsShown()
        await ProfileScreen.notificationsLink.click()

        await NotificationScreen.waitForIsShown()
        if (flags.isWeb) {
          expect(
            await NotificationScreen.authorizeEmailButton.getAttribute('aria-disabled')
          ).toEqual('true')
        } else {
          expect(await NotificationScreen.authorizeEmailButton.isEnabled()).toEqual(false)
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
    })
  })
})
