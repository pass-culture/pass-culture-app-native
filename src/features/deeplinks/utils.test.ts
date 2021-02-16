import { env } from 'libs/environment'

import { DEEP_LINK, UNIVERSAL_LINK } from './utils'

describe('Formatting deeplink url', () => {
  afterAll(() => jest.resetAllMocks())

  it('should format properly the deeplink', () => {
    expect(DEEP_LINK).toEqual(`${env.URL_PREFIX}://app.${env.URL_PREFIX}.${env.ENV}/`)
  })

  it('should format properly the universal link', () => {
    expect(UNIVERSAL_LINK).toEqual(`https://${env.UNIVERSAL_LINK}/`)
  })
})
