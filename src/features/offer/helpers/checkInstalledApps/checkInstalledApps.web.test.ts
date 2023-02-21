import { checkInstalledApps } from 'features/offer/helpers/checkInstalledApps/checkInstalledApps'
import { Network } from 'ui/components/ShareMessagingApp'

const supportedApps = [Network.whatsapp, Network.telegram, Network.twitter]
const unsupportedApps = Object.values(Network).filter((network) => !supportedApps.includes(network))

describe('checkInstalledApps', () => {
  it('should always be false for unsupported apps', async () => {
    const apps = await checkInstalledApps()

    unsupportedApps.forEach((network) => {
      expect(apps[network]).toBeFalsy()
    })
  })

  it('should always be true for supported apps', async () => {
    const apps = await checkInstalledApps()

    supportedApps.forEach((network) => {
      expect(apps[network]).toBeTruthy()
    })
  })
})
