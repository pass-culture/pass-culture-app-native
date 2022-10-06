/* eslint-disable @typescript-eslint/ban-ts-comment */
import { v4 as uuidv4 } from 'uuid'

import { navigateFromRef } from 'features/navigation/navigationRef'
import { Headers } from 'libs/fetch'
import { getAccessTokenStatus } from 'libs/jwt'
import { clearRefreshToken, getRefreshToken } from 'libs/keychain'
import { eventMonitoring } from 'libs/monitoring'
import { getUniqueId } from 'libs/react-native-device-info/getUniqueId'
import { storage } from 'libs/storage'

import Package from '../../package.json'

import { DefaultApi } from './gen'

function navigateToLogin(params?: Record<string, unknown>) {
  navigateFromRef('Login', params)
}

export async function getAuthenticationHeaders(options?: RequestInit): Promise<Headers> {
  if (options && options.credentials === 'omit') return {}

  const accessToken = await storage.readString('access_token')
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
}

// At the moment, we can't Promise.reject inside of safeFetch and expect
// the wrapping AsyncBoundary to catch it. As a result, we resolve a fake
// response that we then catch to redirect to the login page.
// this happens when there is a problem retrieving or refreshing
// the access token.
export const NeedsAuthenticationResponse = {
  status: 401,
  statusText: 'NeedsAuthenticationResponse',
} as Response

export const RefreshTokenExpiredResponse = new Response('', {
  status: 401,
  statusText: 'RefreshTokenExpired',
})

/**
 * For each http calls to the api, retrieves the access token and fetchs.
 * Ignores native/v1/refresh_access_token.
 *
 * First decodes the local access token:
 * on success: continue to the call
 * on error (401): try to refresh the access token
 * on error (other): propagates error
 */
export const safeFetch = async (
  url: string,
  options: RequestInit,
  api: DefaultApi
): Promise<Response> => {
  let runtimeOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      'device-id': await getUniqueId(),
      'app-version': Package.version,
      'request-id': uuidv4(),
    },
  }

  if (options.credentials === 'omit') {
    return await fetch(url, runtimeOptions)
  }

  // @ts-expect-error
  const authorizationHeader: string = options.headers?.['Authorization'] || ''
  const token = authorizationHeader.replace('Bearer ', '')
  const accessTokenStatus = getAccessTokenStatus(token)

  if (accessTokenStatus === 'unknown') {
    return NeedsAuthenticationResponse
  }

  // If the token is expired, we refresh it before calling the backend
  if (accessTokenStatus === 'expired') {
    try {
      const { result: newAccessToken, error } = await refreshAccessToken(api)
      if (error === REFRESH_TOKEN_IS_EXPIRED_ERROR) {
        return RefreshTokenExpiredResponse
      }

      if (error) {
        eventMonitoring.captureException(new Error(`safeFetch ${error}`))
        return NeedsAuthenticationResponse
      }

      runtimeOptions = {
        ...runtimeOptions,
        headers: {
          ...runtimeOptions.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      }
    } catch (error) {
      // Here we are supposed to be logged-in (calling an authenticated endpoint)
      // But the access token is expired and cannot be refreshed.
      // In this case, we cleared the access token and we need to login again
      eventMonitoring.captureException(new Error(`safeFetch ${error}`))
      return NeedsAuthenticationResponse
    }
  }

  return await fetch(url, runtimeOptions)
}

const FAILED_TO_GET_REFRESH_TOKEN_ERROR = 'Erreur lors de la récupération du refresh token'
const REFRESH_TOKEN_IS_EXPIRED_ERROR = 'Le refresh token est expiré'
const UNKNOWN_ERROR_WHILE_REFRESHING_ACCESS_TOKEN =
  'Une erreur inconnue est survenue lors de la regénération de l’access token'
type Result =
  | { result: string; error?: never }
  | {
      result?: never
      error:
        | typeof FAILED_TO_GET_REFRESH_TOKEN_ERROR
        | typeof REFRESH_TOKEN_IS_EXPIRED_ERROR
        | typeof UNKNOWN_ERROR_WHILE_REFRESHING_ACCESS_TOKEN
    }

/**
 * Calls Api to refresh the access token using the in-keychain stored refresh token
 * - on success: Stores the new access token
 * - on error : clear storage propagates error
 */
export const refreshAccessToken = async (
  api: DefaultApi,
  remainingRetries = 1
): Promise<Result> => {
  const refreshToken = await getRefreshToken()

  if (refreshToken == null) {
    await storage.clear('access_token')
    return { error: FAILED_TO_GET_REFRESH_TOKEN_ERROR }
  }
  try {
    const response = await api.postnativev1refreshAccessToken({
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })

    await storage.saveString('access_token', response.accessToken)

    return { result: response.accessToken }
  } catch (error) {
    if (remainingRetries !== 0) {
      return refreshAccessToken(api, remainingRetries - 1)
    }

    await clearRefreshToken()
    await storage.clear('access_token')

    if (error instanceof ApiError && error.statusCode === 401) {
      return { error: REFRESH_TOKEN_IS_EXPIRED_ERROR }
    }

    return { error: UNKNOWN_ERROR_WHILE_REFRESHING_ACCESS_TOKEN }
  }
}

const extractResponseBody = async (response: Response): Promise<string> => {
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  }
  return await response.text()
}

// In this case, the following `any` is not that much of a problem in the context of usage
// with the autogenerated files of swagger-codegen.
// !!! Not encouraging to use `any` anywhere else !!!
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleGeneratedApiResponse(response: Response): Promise<any | void> {
  if (response.status === 204) {
    return {}
  }

  if (response.status === 403) {
    const bannedCountry = response.headers.get('x-country-ban')
    if (bannedCountry) {
      navigateFromRef('BannedCountryError')
      return {}
    }
    navigateFromRef('SuspensionScreen')
    return {}
  }

  // We are not suppose to have side-effects in this function but this is a special case
  // where the access token is corrupted and we need to recreate it by logging-in again
  if (
    response.status === NeedsAuthenticationResponse.status &&
    response.statusText === NeedsAuthenticationResponse.statusText
  ) {
    try {
      const json = await response.json()
      eventMonitoring.captureException(new Error(NeedsAuthenticationResponse.statusText), {
        extra: {
          url: response.url,
          status: response.status,
          statusText: response.statusText,
          json,
        },
      })
    } catch (error) {
      eventMonitoring.captureException(new Error(NeedsAuthenticationResponse.statusText), {
        extra: {
          scope: 'NeedsAuthenticationResponseCannotParseJSON',
          url: response.url,
          status: response.status,
          statusText: response.statusText,
        },
      })
    }
    navigateToLogin()
    return {}
  }

  if (
    response.status === RefreshTokenExpiredResponse.status &&
    response.statusText === RefreshTokenExpiredResponse.statusText
  ) {
    navigateToLogin({ displayForcedLoginHelpMessage: true })
    return {}
  }

  const responseBody = await extractResponseBody(response)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      responseBody,
      `Échec de la requête ${response.url}, code: ${response.status}`
    )
  }

  return responseBody
}

export function isApiError(error: ApiError | unknown): error is ApiError {
  return (error as ApiError).name === 'ApiError'
}

export class ApiError extends Error {
  name = 'ApiError'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  statusCode: number

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(statusCode: number, content: any, message?: string) {
    super(message)
    this.content = content
    this.statusCode = statusCode
  }
}

export function extractApiErrorMessage(error: unknown) {
  let message = 'Une erreur est survenue'
  if (isApiError(error)) {
    const { content } = error as { content: { code: string; message: string } }
    if (content && content.code && content.message) {
      message = content.message
    }
  }
  return message
}
