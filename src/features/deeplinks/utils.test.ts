import { env } from 'libs/environment'

import { formatDeeplinkDomain } from './utils'

describe('Formatting deeplink url', () => {
  afterAll(() => jest.resetAllMocks())

  it('should format properly the deeplink domain', () => {
    const deeplinkUrl = formatDeeplinkDomain()
    expect(deeplinkUrl).toEqual(`${env.URL_PREFIX}://app.${env.URL_PREFIX}.${env.ENV}/`)
  })
})
