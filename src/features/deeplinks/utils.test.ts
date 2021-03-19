import { env } from 'libs/environment'

import { DEEPLINK_DOMAIN } from './utils'

describe('Formatting deeplink url', () => {
  afterAll(() => jest.resetAllMocks())

  it('should format properly the universal link', () => {
    expect(DEEPLINK_DOMAIN).toEqual(`https://${env.UNIVERSAL_LINK}/`)
  })
})
