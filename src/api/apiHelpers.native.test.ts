import { Platform } from 'react-native'

import * as NavigationRef from 'features/navigation/navigationRef'
import { env } from 'libs/environment/env'
import * as jwt from 'libs/jwt/jwt'
import * as Keychain from 'libs/keychain/keychain'
import { eventMonitoring } from 'libs/monitoring/services'
import * as PackageJson from 'libs/packageJson'
import { mockServer } from 'tests/mswServer'

import { ApiError } from './ApiError'
import {
  createNeedsAuthenticationResponse,
  handleGeneratedApiResponse,
  isAPIExceptionCapturedAsInfo,
  isAPIExceptionNotCaptured,
  safeFetch,
} from './apiHelpers'
import { Configuration, DefaultApi, RefreshResponse } from './gen'
import { removeRefreshedAccessToken } from './refreshAccessToken'

jest.spyOn(PackageJson, 'getAppVersion').mockReturnValue('1.10.5')

jest.mock('libs/keychain/keychain')
jest.mock('libs/react-native-device-info/getDeviceId')
jest.mock('libs/jwt/jwt')

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

const apiUrl = '/native/v1/me'
const optionsWithAccessToken = {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
}

const tokenRemainingLifetimeInMs = 10 * 60 * 1000
jest.spyOn(jwt, 'computeTokenRemainingLifetimeInMs').mockReturnValue(tokenRemainingLifetimeInMs)

jest.useFakeTimers()

describe('[api] helpers', () => {
  const mockFetch = jest.spyOn(global, 'fetch')
  const mockGetTokenStatus = jest.spyOn(jwt, 'getTokenStatus')
  const mockGetRefreshToken = jest.spyOn(Keychain, 'getRefreshToken')

  afterEach(() => {
    mockFetch.mockReset()
    removeRefreshedAccessToken()
  })

  describe('[method] safeFetch', () => {
    it('should call fetch with populated header', async () => {
      mockGetTokenStatus.mockReturnValueOnce('valid')
      mockFetch.mockResolvedValueOnce(respondWith('apiResponse'))
      const response = await safeFetch('url', optionsWithAccessToken, api)

      expect(mockFetch).toHaveBeenCalledWith('url', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'app-version': '1.10.5',
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
          'commit-hash': env.COMMIT_HASH,
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
          platform: Platform.OS,
          'request-id': 'testUuidV4',
        },
      })
      expect(response).toEqual(await respondWith('apiResponse'))
    })

    it('needs authentication response when refresh token fails', async () => {
      mockServer.postApi<RefreshResponse>('/v1/refresh_access_token', {
        responseOptions: {
          statusCode: 400,
        },
      })

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

      expect(response).toEqual(createNeedsAuthenticationResponse(apiUrl))
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

    it('should refresh access token when it is unknown and refresh token is valid', async () => {
      mockGetTokenStatus.mockReturnValueOnce('unknown')
      const expectedResponse = await respondWith('some api response')
      mockFetch
        .mockResolvedValueOnce(respondWith({ accessToken }))
        .mockResolvedValueOnce(expectedResponse)

      const response = await safeFetch(apiUrl, {}, api)

      const refreshAccessTokenCalls = 1
      const apiURLCalls = 1

      expect(mockFetch).toHaveBeenCalledTimes(refreshAccessTokenCalls + apiURLCalls)

      expect(response).toEqual(expectedResponse)
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

    it('log exception to sentry when cannot get refresh token', async () => {
      const error = new Error('Error')
      mockGetTokenStatus.mockReturnValueOnce('expired')
      mockGetRefreshToken.mockRejectedValueOnce(error)

      await safeFetch(apiUrl, optionsWithAccessToken, api)

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(new Error('safeFetch Error'), {
        extra: { url: '/native/v1/me', error },
      })
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
          'commit-hash': env.COMMIT_HASH,
          'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
          platform: Platform.OS,
          'request-id': 'testUuidV4',
        },
      })
      expect(response).toEqual(await expectedResponse)
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

      expect(navigateFromRef).toHaveBeenCalledWith('AccountStatusScreenHandler')
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

    it('should capture a detailed error on Sentry when status is 401', async () => {
      const response = await respondWith('apiResponse', 401)

      const getResult = () => {
        return handleGeneratedApiResponse(response)
      }
      const error = new ApiError(
        401,
        'apiResponse',
        `Échec de la requête ${response.url}, code: ${response.status}`
      )

      await expect(getResult).rejects.toThrow(error)

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        new Error('handleGeneratedApiResponse'),
        {
          extra: { responseBody: 'apiResponse' },
        }
      )
    })

    it('should navigate to login when access and refresh tokens are invalid', async () => {
      const result = await handleGeneratedApiResponse(createNeedsAuthenticationResponse(apiUrl))

      expect(navigateFromRef).toHaveBeenCalledWith('Login', undefined)
      expect(result).toEqual({})
    })
  })

  describe('isAPIExceptionCapturedAsInfo', () => {
    it.each([
      400, // Unauthorized
      500, // Internal Server Error
      502, // Bad Gateway
      503, // Service Unavailable
      504, // Gateway Timeout
    ])('should return false when error code is %s', (statusCode) => {
      expect(isAPIExceptionCapturedAsInfo(statusCode)).toEqual(false)
    })

    it('should return true when error code is 401', () => {
      expect(isAPIExceptionCapturedAsInfo(401)).toEqual(true)
    })
  })

  describe('isAPIExceptionNotCaptured', () => {
    it.each([
      500, // Internal Server Error
      502, // Bad Gateway
      503, // Service Unavailable
      504, // Gateway Timeout
    ])('should return true when error code is %s', (statusCode) => {
      expect(isAPIExceptionNotCaptured(statusCode)).toEqual(true)
    })

    it('should return false when error code is 401', () => {
      expect(isAPIExceptionNotCaptured(401)).toEqual(false)
    })
  })
})
