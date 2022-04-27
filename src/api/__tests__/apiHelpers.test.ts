import * as jwt from 'libs/jwt'
import * as Keychain from 'libs/keychain'

import { NeedsAuthenticationResponse, safeFetch } from '../apiHelpers'
import { DefaultApi } from '../gen'

const api = new DefaultApi({})

const respondWith = async (body: unknown): Promise<Response> => {
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json',
    },
  })
}

const accessToken = 'some fake access token'
const optionsWithAccessToken = {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
}

describe('[api] helpers', () => {
  const mockFetch = jest.spyOn(global, 'fetch')
  const mockGetAccessTokenStatus = jest.spyOn(jwt, 'getAccessTokenStatus')
  const mockKeychain = jest.spyOn(Keychain, 'getRefreshToken')

  describe('[method] safeFetch', () => {
    it('should call fetch with populated header', async () => {
      mockGetAccessTokenStatus.mockReturnValueOnce('valid')
      mockFetch.mockResolvedValueOnce(respondWith('apiResponse'))
      const response = await safeFetch('url', optionsWithAccessToken, api)
      expect(mockFetch).toHaveBeenCalledWith('url', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'app-version': '1.10.5',
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        },
      })
      expect(response).toEqual(await respondWith('apiResponse'))
    })
    it('should call fetch with populated header when route is in NotAuthenticatedCalls', async () => {
      mockGetAccessTokenStatus.mockReturnValueOnce('valid')
      mockFetch.mockResolvedValueOnce(respondWith('apiResponse'))
      const response = await safeFetch('native/v1/account', optionsWithAccessToken, api)
      expect(mockFetch).toHaveBeenCalledWith('native/v1/account', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'app-version': '1.10.5',
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        },
      })
      expect(response).toEqual(await respondWith('apiResponse'))
    })

    it('needs authentication response when refresh token fails', async () => {
      mockGetAccessTokenStatus.mockReturnValueOnce('expired')
      mockFetch.mockRejectedValueOnce('some error')

      const response = await safeFetch('/native/v1/me', optionsWithAccessToken, api)

      expect(response).toEqual(NeedsAuthenticationResponse)
    })

    it('regenerates the access token and fetch the real url after when the access token is expired', async () => {
      const apiUrl = '/native/v1/me'
      mockGetAccessTokenStatus.mockReturnValueOnce('expired')
      const expectedResponse = respondWith('some api response')
      mockFetch
        .mockResolvedValueOnce(respondWith({ accessToken }))
        .mockResolvedValueOnce(expectedResponse)

      const response = await safeFetch(apiUrl, optionsWithAccessToken, api)

      expect(mockFetch).toHaveBeenCalledWith(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'app-version': '1.10.5',
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        },
      })
      expect(response).toEqual(await expectedResponse)
    })

    it('needs authentication response when there is no access token', async () => {
      mockGetAccessTokenStatus.mockReturnValueOnce('unknown')

      const response = await safeFetch('/native/v1/me', {}, api)

      expect(response).toEqual(NeedsAuthenticationResponse)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('needs authentication response when there is no refresh token', async () => {
      mockGetAccessTokenStatus.mockReturnValueOnce('expired')
      mockKeychain.mockResolvedValueOnce(null)

      const response = await safeFetch('/native/v1/me', optionsWithAccessToken, api)

      expect(response).toEqual(NeedsAuthenticationResponse)
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })
})
