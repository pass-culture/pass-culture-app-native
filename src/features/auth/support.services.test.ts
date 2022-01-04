import waitForExpect from 'wait-for-expect'

import { openUrl } from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics'

import { contactSupport } from './support.services'

jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

jest.mock('./support.services', () => jest.requireActual('./support.services'))

describe('Support services', () => {
  Object.keys(contactSupport).forEach((key) => {
    it(`${key} should open external url for contacting support with analytics`, async () => {
      const method = key as keyof typeof contactSupport
      mockedOpenUrl.mockResolvedValueOnce(undefined)

      contactSupport[method]()
      await waitForExpect(() => {
        expect(openUrl).toBeCalled()
        expect(analytics.logMailTo).toBeCalledWith(key)
      })
    })
  })
})
