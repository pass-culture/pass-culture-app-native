import waitForExpect from 'wait-for-expect'

import * as NavigationHelpers from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'

import { contactSupport } from './support.services'

jest.mock('./support.services', () => jest.requireActual('./support.services'))

describe('Support services', () => {
  afterEach(jest.clearAllMocks)

  Object.keys(contactSupport).forEach((key) => {
    it(`${key} should open external url for contacting support with analytics`, async () => {
      const method = key as keyof typeof contactSupport
      const email = 'test@test.com'
      const openUrl = jest.spyOn(NavigationHelpers, 'openUrl').mockResolvedValueOnce(undefined)

      contactSupport[method](email)
      await waitForExpect(() => {
        expect(openUrl).toBeCalled()
        expect(analytics.logMailTo).toBeCalledWith(key)
      })
    })
  })
})
