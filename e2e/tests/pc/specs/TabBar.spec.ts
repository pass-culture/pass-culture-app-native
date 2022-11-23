import FirstLaunch from '../helpers/FirstLaunch'
import TabBar from '../features/navigation/TabBar'
import { didFirstLaunch } from '../helpers/utils/error'

describe('TabBar', () => {
  let ok = false

  it('should do first launch initialisation', async () => {
    ok = await FirstLaunch.init()
  })

  it('should click on search', async () => {
    didFirstLaunch(ok)
    await TabBar.search.click()
  })

  it('should click on profile', async () => {
    didFirstLaunch(ok)
    await TabBar.profil.click()
  })

  it('should click on favorite', async () => {
    didFirstLaunch(ok)
    await TabBar.favorite.click()
  })

  it('should click on home', async () => {
    didFirstLaunch(ok)
    await TabBar.home.click()
  })
})
