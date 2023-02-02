import { checkInstalledApps } from 'features/offer/helpers/checkInstalledApps/checkInstalledApps'

describe('checkInstalledApps', () => {
  it('should always be true in web because any link can be opened in browser', async () => {
    const apps = await checkInstalledApps()

    Object.values(apps).forEach((isInstalled) => {
      expect(isInstalled).toBeTruthy()
    })
  })
})
