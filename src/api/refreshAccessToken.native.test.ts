import AsyncStorage from '@react-native-async-storage/async-storage'

import { api } from 'api/api'
import * as jwt from 'libs/jwt/jwt'
import * as Keychain from 'libs/keychain/keychain'
import { eventMonitoring } from 'libs/monitoring'

import { refreshAccessToken, removeRefreshedAccessToken } from './refreshAccessToken'

jest.mock('libs/keychain/keychain')
jest.mock('libs/jwt/jwt')

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
jest.spyOn(jwt, 'computeTokenRemainingLifetimeInMs').mockReturnValue(tokenRemainingLifetimeInMs)
const mockFetch = jest.spyOn(global, 'fetch')
const mockGetRefreshToken = jest.spyOn(Keychain, 'getRefreshToken')
const mockClearRefreshToken = jest.spyOn(Keychain, 'clearRefreshToken')

jest.useFakeTimers()

describe('refreshAccessToken', () => {
  afterEach(removeRefreshedAccessToken)

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
