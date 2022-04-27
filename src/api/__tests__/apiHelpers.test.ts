import AsyncStorage from '@react-native-async-storage/async-storage'

import { FailedToRefreshAccessTokenError } from 'libs/fetch'
import * as jwt from 'libs/jwt'
import * as Keychain from 'libs/keychain'

import { NeedsAuthenticationResponse, refreshAccessToken, safeFetch } from '../apiHelpers'
import { DefaultApi } from '../gen'

const api = new DefaultApi({})

const respondWith = async (body: unknown, status = 200): Promise<Response> => {
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json',
    },
    status,
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
  const mockGetRefreshToken = jest.spyOn(Keychain, 'getRefreshToken')
  const mockClearRefreshToken = jest.spyOn(Keychain, 'clearRefreshToken')

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
      mockGetRefreshToken.mockResolvedValueOnce(null)

      const response = await safeFetch('/native/v1/me', optionsWithAccessToken, api)

      expect(response).toEqual(NeedsAuthenticationResponse)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('retries to regenerate the access token when the access token is expired and the first try to regenerate fails', async () => {
      const apiUrl = '/native/v1/me'
      mockGetAccessTokenStatus.mockReturnValueOnce('expired')
      const password = 'refreshToken'
      mockGetRefreshToken.mockResolvedValueOnce(password).mockResolvedValueOnce(password)
      const expectedResponse = respondWith('some api response')
      mockFetch
        .mockRejectedValueOnce('some error')
        .mockResolvedValueOnce(respondWith({ accessToken }))
        .mockResolvedValueOnce(expectedResponse)

      const response = await safeFetch(apiUrl, optionsWithAccessToken, api)

      expect(mockFetch).nthCalledWith(1, '/native/v1/refresh_access_token', {
        headers: {
          Authorization: `Bearer ${password}`,
          'app-version': '1.10.5',
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        },
        credentials: 'omit',
        method: 'POST',
      })
      expect(mockFetch).nthCalledWith(2, '/native/v1/refresh_access_token', {
        headers: {
          Authorization: `Bearer ${password}`,
          'app-version': '1.10.5',
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        },
        credentials: 'omit',
        method: 'POST',
      })
      expect(mockFetch).nthCalledWith(3, apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'app-version': '1.10.5',
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        },
      })
      expect(response).toEqual(await expectedResponse)
    })
  })

  describe('refreshAccessToken', () => {
    it('should remove access token when there is no refresh token', async () => {
      mockGetRefreshToken.mockResolvedValueOnce(null)

      await refreshAccessToken(api, 0)

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('access_token')
    })

    it('should return FAILED_TO_GET_REFRESH_TOKEN_ERROR when there is no refresh token', async () => {
      mockGetRefreshToken.mockResolvedValueOnce(null)

      const result = await refreshAccessToken(api, 0)

      expect(result).toEqual({ error: 'Erreur lors de la récupération du refresh token' })
    })

    it('should store the new access token when everything is ok', async () => {
      const password = 'refreshToken'
      mockGetRefreshToken.mockResolvedValueOnce(password)
      mockFetch.mockResolvedValueOnce(respondWith({ accessToken }))

      await refreshAccessToken(api, 0)

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('access_token', accessToken)
    })

    it('should return the new access token when everything is ok', async () => {
      const password = 'refreshToken'
      mockGetRefreshToken.mockResolvedValueOnce(password)
      mockFetch.mockResolvedValueOnce(respondWith({ accessToken }))

      const result = await refreshAccessToken(api, 0)

      expect(result).toEqual({ result: accessToken })
    })

    it('should remove tokens when there is an unexpected behavior', async () => {
      const password = 'refreshToken'
      mockGetRefreshToken.mockResolvedValueOnce(password)
      mockFetch.mockResolvedValueOnce(respondWith({ error: 'server error' }, 500))

      try {
        await refreshAccessToken(api, 0)
      } catch {
        // tested in his own test
      }

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('access_token')
      expect(mockClearRefreshToken).toHaveBeenCalled()
    })

    it('should reject with an exception when there is an unexpected behavior', async () => {
      const password = 'refreshToken'
      mockGetRefreshToken.mockResolvedValueOnce(password)
      mockFetch.mockResolvedValueOnce(respondWith({ error: 'server error' }, 500))

      const resultPromise = refreshAccessToken(api, 0)

      await expect(resultPromise).rejects.toEqual(new FailedToRefreshAccessTokenError())
    })

    it('should retry to refresh access token when the first call fails', async () => {
      const password = 'refreshToken'
      mockGetRefreshToken.mockResolvedValueOnce(password)
      mockFetch
        .mockResolvedValueOnce(respondWith({ error: 'server error' }, 500))
        .mockResolvedValueOnce(respondWith({ accessToken }))

      const result = await refreshAccessToken(api, 1)

      expect(result).toEqual({ result: accessToken })
    })
  })
})
