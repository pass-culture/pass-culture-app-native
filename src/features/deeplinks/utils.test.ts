import { env } from 'libs/environment'

import { DEEPLINK_DOMAIN } from './utils'

describe('Formatting deeplink url', () => {
  afterAll(() => jest.resetAllMocks())

  it('should format properly the deeplink domain', () => {
    expect(DEEPLINK_DOMAIN).toEqual(`${env.URL_PREFIX}://app.${env.URL_PREFIX}.${env.ENV}/`)
  })
})
