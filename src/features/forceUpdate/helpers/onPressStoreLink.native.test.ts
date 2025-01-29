import { STORE_LINK } from 'features/forceUpdate/constants'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics'
import * as PackageJson from 'libs/packageJson'

import { onPressStoreLink } from './onPressStoreLink'

jest.mock('libs/analytics')
jest.mock('features/navigation/helpers/openUrl')
jest.mock('libs/packageJson', () => ({
  getAppBuildVersion: jest.fn(),
}))

const buildVersion = 10010005
jest.spyOn(PackageJson, 'getAppBuildVersion').mockReturnValue(buildVersion)

describe('onPressStoreLink', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should call openStore with store link', async () => {
    await onPressStoreLink()

    expect(openUrl).toHaveBeenCalledWith(STORE_LINK)
  })

  it('should log analytics', async () => {
    await onPressStoreLink()

    expect(analytics.logClickForceUpdate).toHaveBeenCalledWith(buildVersion)
  })
})
