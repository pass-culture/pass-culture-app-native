import { TabBar } from '../features/navigation/TabBar'
import NotificationScreen from '../features/profile/NotificationScreen'
import ProfileScreen from '../features/profile/ProfileScreen'
import { didFirstLaunch } from '../helpers/utils/error'
import { DefaultTheme, getTheme } from '../helpers/utils/theme'

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

  describe('offline', () => {
    it('should display a disabled "Autoriser les notifications marketing" button on iOS', async () => {
      await ProfileScreen.waitForIsShown()
      await ProfileScreen.notificationsLink.click()
      await NotificationScreen.marketingButton.waitForDisplayed()
      expect(await NotificationScreen.marketingButton.isEnabled()).toEqual(false)
    })
  })
})
