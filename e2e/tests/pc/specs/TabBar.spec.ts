import FirstLaunch from '../helpers/FirstLaunch'
import { TabBar } from '../features/navigation/TabBar'
import { didFirstLaunch } from '../helpers/utils/error'
import { getTheme } from '../helpers/utils/theme'

describe('TabBar', () => {
  let ok = false
  let tabBar: TabBar

  before(async () => {
    const theme = getTheme(await browser.getWindowSize())
    tabBar = new TabBar(theme)
  })

  it('should first launch app', async () => {
    ok = await FirstLaunch.init(tabBar)
  })

  it('should click on search', async () => {
    didFirstLaunch(ok)
    await tabBar.search.click()
  })

  it('should click on profile', async () => {
    didFirstLaunch(ok)
    await tabBar.profil.click()
  })

  it('should click on favorite', async () => {
    didFirstLaunch(ok)
    await tabBar.favorite.click()
  })

  it('should click on home', async () => {
    didFirstLaunch(ok)
    await tabBar.home.click()
  })
})
