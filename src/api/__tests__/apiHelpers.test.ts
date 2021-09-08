import { safeFetch } from '../apiHelpers'
import { DefaultApi } from '../gen'

global.fetch = jest.fn().mockResolvedValue('apiResponse')
const api = new DefaultApi({})

describe('[api] helpers', () => {
  describe('[method] safeFetch', () => {
    it('should call fetch with populated header', async () => {
      const response = await safeFetch('url', {}, api)
      expect(global.fetch).toHaveBeenCalledWith('url', {
        headers: {
          'app-version': '1.10.5',
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        },
      })
      expect(response).toEqual('apiResponse')
    })
    it('should call fetch with populated header when route is in NotAuthenticatedCalls', async () => {
      const response = await safeFetch('native/v1/account', {}, api)
      expect(global.fetch).toHaveBeenCalledWith('native/v1/account', {
        headers: {
          'app-version': '1.10.5',
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        },
      })
      expect(response).toEqual('apiResponse')
    })
  })
})
