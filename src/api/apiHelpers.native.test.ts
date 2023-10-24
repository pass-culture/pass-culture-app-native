import AsyncStorage from '@react-native-async-storage/async-storage'
import mockdate from 'mockdate'
import { rest } from 'msw'
import { Platform } from 'react-native'
import CodePush from 'react-native-code-push'

import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import * as NavigationRef from 'features/navigation/navigationRef'
import { env } from 'libs/environment'
import * as jwt from 'libs/jwt'
import * as Keychain from 'libs/keychain'
import { eventMonitoring } from 'libs/monitoring'
import { server } from 'tests/server'

import {
  ApiError,
  removeRefreshedAccessToken,
  createNeedsAuthenticationResponse,
  handleGeneratedApiResponse,
  isAPIExceptionCapturedAsInfo,
  refreshAccessToken,
  RefreshTokenExpiredResponse,
  safeFetch,
  computeTokenRemainingLifetimeInMs,
} from './apiHelpers'
import { Configuration, DefaultApi, RefreshResponse } from './gen'

mockdate.set(CURRENT_DATE)

const configuration: Configuration = {
  basePath: env.API_BASE_URL,
}
const api = new DefaultApi(configuration)

const respondWith = async (
  body: unknown,
  status = 200,
  statusText?: string,
  headers?: HeadersInit
): Promise<Response> => {
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    status,
    statusText,
  })
}

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY4OTI1NjM1NywianRpIjoiNTFkMjc5OGMtZDc1YS00NjQ1LTg0ZTAtNTgxYmQ3NTQzZGY3IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImJlbmVfMThAZXhhbXBsZS5jb20iLCJuYmYiOjE2ODkyNTYzNTcsImV4cCI6MTY4OTI1NzI1NywidXNlcl9jbGFpbXMiOnsidXNlcl9pZCI6MTI3MTN9fQ.OW09vfchjTx-0LfZiaAJu8eMd9aftExhxR4bUsgl3xw'
const tokenRemainingLifetimeInMs = 10 * 60 * 1000
const decodedAccessToken = {
  fresh: false,
  iat: 1689576398,
  jti: 'a90f96de-185d-4edb-a878-d714eea7ff74',
  type: 'access',
  sub: 'bene_18@example.com',
  nbf: 1689576398,
  exp: (CURRENT_DATE.getTime() + tokenRemainingLifetimeInMs) / 1000,
  user_claims: {
    user_id: 12713,
  },
}

const apiUrl = '/native/v1/me'
const optionsWithAccessToken = {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
}

jest.spyOn(jwt, 'decodeAccessToken').mockReturnValue(decodedAccessToken)

jest.spyOn(CodePush, 'getUpdateMetadata').mockResolvedValue(null)

jest.useFakeTimers({ legacyFakeTimers: true })

describe('[api] helpers', () => {
  const mockFetch = jest.spyOn(global, 'fetch')
  const mockGetTokenStatus = jest.spyOn(jwt, 'getTokenStatus')
  const mockGetRefreshToken = jest.spyOn(Keychain, 'getRefreshToken')
  const mockClearRefreshToken = jest.spyOn(Keychain, 'clearRefreshToken')

  afterEach(removeRefreshedAccessToken)

  describe('[method] safeFetch', () => {
    it('should call fetch with populated header', async () => {
      mockGetTokenStatus.mockReturnValueOnce('valid')
      mockFetch.mockResolvedValueOnce(respondWith('apiResponse'))
      const response = await safeFetch('url', optionsWithAccessToken, api)

      expect(mockFetch).toHaveBeenCalledWith('url', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'app-version': '1.10.5',
          'code-push-id': '',
          'commit-hash': env.COMMIT_HASH,
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
          platform: Platform.OS,
          'request-id': 'testUuidV4',
        },
      })
      expect(response).toEqual(await respondWith('apiResponse'))
    })

    it('should call fetch with populated header when route is in NotAuthenticatedCalls', async () => {
      mockGetTokenStatus.mockReturnValueOnce('valid')
      mockFetch.mockResolvedValueOnce(respondWith('apiResponse'))
      const response = await safeFetch('native/v1/account', optionsWithAccessToken, api)

      expect(mockFetch).toHaveBeenCalledWith('native/v1/account', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'app-version': '1.10.5',
          'code-push-id': '',
          'commit-hash': env.COMMIT_HASH,
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
          platform: Platform.OS,
          'request-id': 'testUuidV4',
        },
      })
      expect(response).toEqual(await respondWith('apiResponse'))
    })

    it('needs authentication response when refresh token fails', async () => {
      server.use(
        rest.post<RefreshResponse>(
          `${env.API_BASE_URL}/native/v1/refresh_access_token`,
          (_req, res, ctx) => res(ctx.status(400), ctx.json({}))
        )
      )

      mockGetTokenStatus.mockReturnValueOnce('expired')

      const response = await safeFetch(apiUrl, optionsWithAccessToken, api)

      expect(response).toEqual(createNeedsAuthenticationResponse(apiUrl))
    })

    it('forces user to login when refresh token is expired', async () => {
      mockGetTokenStatus.mockReturnValueOnce('expired')
      // mock refresh access token response
      mockFetch.mockRejectedValueOnce(new ApiError(401, 'unauthorized'))
      // mock refresh access token response for the retry
      mockFetch.mockRejectedValueOnce(new ApiError(401, 'unauthorized'))

      const response = await safeFetch(apiUrl, optionsWithAccessToken, api)

      expect(response).toEqual(RefreshTokenExpiredResponse)
    })

    it('regenerates the access token and fetch the real url after when the access token is expired', async () => {
      mockGetTokenStatus.mockReturnValueOnce('expired')
      const expectedResponse = respondWith('some api response')
      mockFetch
        .mockResolvedValueOnce(respondWith({ accessToken }))
        .mockResolvedValueOnce(expectedResponse)

      const response = await safeFetch(apiUrl, optionsWithAccessToken, api)

      expect(mockFetch).toHaveBeenCalledWith(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'app-version': '1.10.5',
          'code-push-id': '',
          'commit-hash': env.COMMIT_HASH,
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
          platform: Platform.OS,
          'request-id': 'testUuidV4',
        },
      })
      expect(response).toEqual(await expectedResponse)
    })

    it('should call refreshAccessToken route once when no error', async () => {
      mockGetTokenStatus.mockReturnValueOnce('expired').mockReturnValueOnce('expired')
      const expectedResponse = respondWith('some api response')
      mockFetch
        .mockResolvedValueOnce(respondWith({ accessToken }))
        .mockResolvedValueOnce(expectedResponse)
        .mockResolvedValueOnce(expectedResponse)

      await Promise.all([
        safeFetch(apiUrl, optionsWithAccessToken, api),
        safeFetch(apiUrl, optionsWithAccessToken, api),
      ])

      const refreshAccessTokenCalls = 1
      const apiURLCalls = 2

      expect(mockFetch).toHaveBeenCalledTimes(refreshAccessTokenCalls + apiURLCalls)
    })

    it('should not call refreshAccessToken route while the token is still valid', async () => {
      mockGetTokenStatus.mockReturnValueOnce('expired').mockReturnValueOnce('expired')
      const expectedResponse = respondWith('some api response')
      mockFetch
        .mockResolvedValueOnce(respondWith({ accessToken }))
        .mockResolvedValueOnce(expectedResponse)
        .mockResolvedValueOnce(expectedResponse)

      await safeFetch(apiUrl, optionsWithAccessToken, api)

      jest.advanceTimersByTime(tokenRemainingLifetimeInMs - 1)

      await safeFetch(apiUrl, optionsWithAccessToken, api)

      const refreshAccessTokenCalls = 1
      const apiURLCalls = 2

      expect(mockFetch).toHaveBeenCalledTimes(refreshAccessTokenCalls + apiURLCalls)
    })

    it("should call refreshAccessToken route again after 15 minutes (access token's lifetime)", async () => {
      mockGetTokenStatus.mockReturnValueOnce('expired').mockReturnValueOnce('expired')
      const expectedResponse = respondWith('some api response')
      mockFetch
        .mockResolvedValueOnce(respondWith({ accessToken }))
        .mockResolvedValueOnce(expectedResponse)
        .mockResolvedValueOnce(respondWith({ accessToken }))
        .mockResolvedValueOnce(expectedResponse)

      await safeFetch(apiUrl, optionsWithAccessToken, api)

      jest.advanceTimersByTime(tokenRemainingLifetimeInMs)

      await safeFetch(apiUrl, optionsWithAccessToken, api)

      const refreshAccessTokenCalls = 2
      const apiURLCalls = 2

      expect(mockFetch).toHaveBeenCalledTimes(refreshAccessTokenCalls + apiURLCalls)
    })

    it('needs authentication response when there is no access token', async () => {
      mockGetTokenStatus.mockReturnValueOnce('unknown')

      const response = await safeFetch(apiUrl, {}, api)

      expect(response).toEqual(createNeedsAuthenticationResponse(apiUrl))
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('needs authentication response when there is no refresh token', async () => {
      mockGetTokenStatus.mockReturnValueOnce('expired')
      mockGetRefreshToken.mockResolvedValueOnce(null)

      const response = await safeFetch(apiUrl, optionsWithAccessToken, api)

      expect(response).toEqual(createNeedsAuthenticationResponse(apiUrl))
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('needs authentication response when cannot get refresh token', async () => {
      mockGetTokenStatus.mockReturnValueOnce('expired')
      mockGetRefreshToken.mockRejectedValueOnce(new Error())

      const response = await safeFetch(apiUrl, optionsWithAccessToken, api)

      expect(response).toEqual(createNeedsAuthenticationResponse(apiUrl))
    })

    it('retries to regenerate the access token when the access token is expired and the first try to regenerate fails', async () => {
      mockGetTokenStatus.mockReturnValueOnce('expired')
      const password = 'refreshToken'
      mockGetRefreshToken.mockResolvedValueOnce(password).mockResolvedValueOnce(password)
      const expectedResponse = respondWith('some api response')
      mockFetch
        .mockRejectedValueOnce('some error')
        .mockResolvedValueOnce(respondWith({ accessToken }))
        .mockResolvedValueOnce(expectedResponse)

      const response = await safeFetch(apiUrl, optionsWithAccessToken, api)

      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        env.API_BASE_URL + '/native/v1/refresh_access_token',
        {
          headers: {
            Authorization: `Bearer ${password}`,
            'app-version': '1.10.5',
            'code-push-id': '',
            'commit-hash': env.COMMIT_HASH,
            'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
            platform: Platform.OS,
            'request-id': 'testUuidV4',
          },
          credentials: 'omit',
          method: 'POST',
        }
      )
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        env.API_BASE_URL + '/native/v1/refresh_access_token',
        {
          headers: {
            Authorization: `Bearer ${password}`,
            'app-version': '1.10.5',
            'code-push-id': '',
            'commit-hash': env.COMMIT_HASH,
            'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
            platform: Platform.OS,
            'request-id': 'testUuidV4',
          },
          credentials: 'omit',
          method: 'POST',
        }
      )
      expect(mockFetch).toHaveBeenNthCalledWith(3, apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'app-version': '1.10.5',
          'code-push-id': '',
          'commit-hash': env.COMMIT_HASH,
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
          platform: Platform.OS,
          'request-id': 'testUuidV4',
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

      await refreshAccessToken(api, 0)

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('access_token')
      expect(mockClearRefreshToken).toHaveBeenCalledTimes(1)
    })

    it('should return UNKNOWN_ERROR_WHILE_REFRESHING_ACCESS_TOKEN when there is an unexpected behavior', async () => {
      const password = 'refreshToken'
      mockGetRefreshToken.mockResolvedValueOnce(password)
      mockFetch.mockResolvedValueOnce(respondWith({ error: 'server error' }, 500))

      const result = await refreshAccessToken(api, 0)

      expect(result).toStrictEqual({
        error: 'Une erreur inconnue est survenue lors de la regénération de l’access token',
      })
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

    it('should remove tokens when refresh token is expired', async () => {
      const password = 'refreshToken'
      mockGetRefreshToken.mockResolvedValueOnce(password)
      mockFetch.mockResolvedValueOnce(respondWith({ error: 'refresh token is expired' }, 401))

      await refreshAccessToken(api, 0)

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('access_token')
      expect(mockClearRefreshToken).toHaveBeenCalledTimes(1)
    })

    it('should return REFRESH_TOKEN_IS_EXPIRED_ERROR when refresh token is expired', async () => {
      const password = 'refreshToken'
      mockGetRefreshToken.mockResolvedValueOnce(password)
      mockFetch.mockResolvedValueOnce(respondWith({ error: 'refresh token is expired' }, 401))

      const result = await refreshAccessToken(api, 0)

      expect(result).toEqual({ error: 'Le refresh token est expiré' })
    })

    it("should log to sentry when can't refresh token", async () => {
      const error = new Error('Error')
      mockFetch.mockRejectedValueOnce(error)

      await refreshAccessToken(api, 0)

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error)
    })
  })

  describe('handleGeneratedApiResponse', () => {
    const navigateFromRef = jest.spyOn(NavigationRef, 'navigateFromRef')

    it('should return body when status is ok', async () => {
      const response = await respondWith('apiResponse')

      const result = await handleGeneratedApiResponse(response)

      expect(result).toEqual('apiResponse')
    })

    it('should return body when status is ok given a plain text response', async () => {
      const response = new Response('apiResponse', { headers: { 'content-type': 'text/plain' } })

      const result = await handleGeneratedApiResponse(response)

      expect(result).toEqual('apiResponse')
    })

    it('should return empty object when status is 204 (no content)', async () => {
      const response = await respondWith('', 204)

      const result = await handleGeneratedApiResponse(response)

      expect(result).toEqual({})
    })

    it('should navigate to suspension screen when status is 403 (forbidden)', async () => {
      const response = await respondWith('', 403)

      const result = await handleGeneratedApiResponse(response)

      expect(navigateFromRef).toHaveBeenCalledWith('SuspensionScreen')
      expect(result).toEqual({})
    })

    it('should navigate to banned country screen when status is 403 (forbidden) with country ban header', async () => {
      const response = await respondWith('', 403, undefined, {
        'x-country-ban': 'CountryName',
      })

      const result = await handleGeneratedApiResponse(response)

      expect(navigateFromRef).toHaveBeenCalledWith('BannedCountryError')
      expect(result).toEqual({})
    })

    it.each([
      400, // Bad Request
      401, // Unauthorized
      404, // Not Found
      500, // Internal Server Error
      502, // Bad Gateway
      503, // Service Unavailable
      504, // Gateway Timeout
    ])('should throw error if status is not ok', async (statusCode) => {
      const response = await respondWith('apiResponse', statusCode)

      const getResult = () => {
        return handleGeneratedApiResponse(response)
      }
      const error = new ApiError(
        statusCode,
        'apiResponse',
        `Échec de la requête ${response.url}, code: ${response.status}`
      )

      await expect(getResult).rejects.toThrow(error)
    })

    it('should navigate to login when access token is invalid', async () => {
      const result = await handleGeneratedApiResponse(createNeedsAuthenticationResponse(apiUrl))

      expect(eventMonitoring.captureMessage).toHaveBeenCalledWith('NeedsAuthenticationResponse', {
        extra: {
          status: 401,
          statusText: 'NeedsAuthenticationResponse',
          url: apiUrl,
        },
      })
      expect(navigateFromRef).toHaveBeenCalledWith('Login', undefined)
      expect(result).toEqual({})
    })

    it('should navigate to login with displayForcedLoginHelpMessage param when refresh token is expired', async () => {
      const response = await respondWith('', 401, 'RefreshTokenExpired')

      const result = await handleGeneratedApiResponse(response)

      expect(navigateFromRef).toHaveBeenCalledWith('Login', { displayForcedLoginHelpMessage: true })
      expect(result).toEqual({})
    })
  })

  describe('isAPIExceptionCapturedAsInfo', () => {
    it.each([
      401, // Unauthorized
      500, // Internal Server Error
      502, // Bad Gateway
      503, // Service Unavailable
      504, // Gateway Timeout
    ])('should return true when error code is %s', (statusCode) => {
      expect(isAPIExceptionCapturedAsInfo(statusCode)).toEqual(true)
    })

    it('should return false when error code is 400', () => {
      expect(isAPIExceptionCapturedAsInfo(400)).toEqual(false)
    })
  })

  describe('computeTokenRemainingLifetimeInMs', () => {
    it('should return undefined when token can not be decoded', () => {
      jest.spyOn(jwt, 'decodeAccessToken').mockReturnValueOnce(null)

      expect(computeTokenRemainingLifetimeInMs('abc')).toBeUndefined()
    })

    it('should return remaining lifetime in milliseconds', () => {
      expect(computeTokenRemainingLifetimeInMs('abc')).toEqual(tokenRemainingLifetimeInMs)
    })
  })
})
