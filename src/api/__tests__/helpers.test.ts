import { DefaultApi } from '../gen'
import { safeFetch } from '../helpers'

global.fetch = jest.fn()
const api = new DefaultApi({})

describe('[api] helpers', () => {
  describe('[method] safeFetch', () => {
    it('should call fetch with populated header', async () => {
      await safeFetch('url', {}, api)
      expect(global.fetch).toHaveBeenCalledWith('url', {
        headers: {
          'app-version': '1.10.5',
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        },
      })
    })
  })
})
