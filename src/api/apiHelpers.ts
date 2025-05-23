/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Platform } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { getCodePushId } from 'api/getCodePushId'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { env } from 'libs/environment/env'
import { Headers } from 'libs/fetch'
import { getTokenStatus } from 'libs/jwt/jwt'
import { eventMonitoring } from 'libs/monitoring/services'
import { getAppVersion } from 'libs/packageJson'
import { getDeviceId } from 'libs/react-native-device-info/getDeviceId'
import { storage } from 'libs/storage'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

import { ApiError } from './ApiError'
import { DefaultApi } from './gen'
import { refreshAccessToken } from './refreshAccessToken'
import {
  FAILED_TO_GET_REFRESH_TOKEN_ERROR,
  LIMITED_CONNECTIVITY_WHILE_REFRESHING_ACCESS_TOKEN,
  REFRESH_TOKEN_IS_EXPIRED_ERROR,
  UNKNOWN_ERROR_WHILE_REFRESHING_ACCESS_TOKEN,
} from './types'

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
const NeedsAuthenticationStatus = {
  status: 401,
  statusText: 'NeedsAuthenticationResponse',
}

export const createNeedsAuthenticationResponse = (url: string) =>
  new Response(url, NeedsAuthenticationStatus)

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
      'app-version': getAppVersion(),
      'code-push-id': await getCodePushId(),
      ...(env.COMMIT_HASH ? { 'commit-hash': env.COMMIT_HASH } : {}),
      'device-id': await getDeviceId(),
      platform: Platform.OS,
      'request-id': uuidv4(),
    },
  }

  if (options.credentials === 'omit') {
    return fetch(url, runtimeOptions)
  }

  const authorizationHeader: string = options.headers?.['Authorization'] || ''
  const token = authorizationHeader.replace('Bearer ', '')
  const accessTokenStatus = getTokenStatus(token)

  // If the token is expired or unknown, we refresh it before calling the backend
  if (accessTokenStatus === 'expired' || accessTokenStatus === 'unknown') {
    try {
      const { result: newAccessToken, error } = await refreshAccessToken(api)

      switch (error) {
        case REFRESH_TOKEN_IS_EXPIRED_ERROR:
        case FAILED_TO_GET_REFRESH_TOKEN_ERROR:
        case LIMITED_CONNECTIVITY_WHILE_REFRESHING_ACCESS_TOKEN:
          return createNeedsAuthenticationResponse(url)
        case UNKNOWN_ERROR_WHILE_REFRESHING_ACCESS_TOKEN:
          throw new Error(UNKNOWN_ERROR_WHILE_REFRESHING_ACCESS_TOKEN)
        case undefined: // When no error
          runtimeOptions = {
            ...runtimeOptions,
            headers: {
              ...runtimeOptions.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      // Here we are supposed to be logged-in (calling an authenticated endpoint)
      // But the access token is expired and cannot be refreshed.
      // In this case, we cleared the access token and we need to login again
      eventMonitoring.captureException(new Error(`safeFetch ${errorMessage}`, { cause: error }), {
        extra: { url, error },
      })
      return createNeedsAuthenticationResponse(url)
    }
  }

  return fetch(url, runtimeOptions)
}

const extractResponseBody = async (response: Response): Promise<string> => {
  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

// In this case, the following `any` is not that much of a problem in the context of usage
// with the autogenerated files of swagger-codegen.
// !!! Not encouraging to use `any` anywhere else !!!
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleGeneratedApiResponse(response: Response): Promise<any> {
  if (response.status === 204) {
    return {}
  }

  if (response.status === 403) {
    const bannedCountry = response.headers.get('x-country-ban')
    if (bannedCountry) {
      navigateFromRef('BannedCountryError')
      return {}
    }
    navigateFromRef('AccountStatusScreenHandler')
    return {}
  }

  // We are not suppose to have side-effects in this function but this is a special case
  // where the access token is corrupted and we need to recreate it by logging-in again
  if (
    response.status === NeedsAuthenticationStatus.status &&
    response.statusText === NeedsAuthenticationStatus.statusText
  ) {
    navigateToLogin()
    return {}
  }

  const responseBody = await extractResponseBody(response)

  if (!response.ok) {
    if (response.status === 401) {
      eventMonitoring.captureException(new Error(`handleGeneratedApiResponse`), {
        extra: { responseBody },
      })
    }

    throw new ApiError(
      response.status,
      responseBody,
      `Échec de la requête ${response.url}, code: ${response.status}`
    )
  }

  return responseBody
}

export function isApiError(error: unknown): error is ApiError {
  return (error as ApiError).name === 'ApiError'
}

export function extractApiErrorMessage(error: unknown) {
  let message = 'Une erreur est survenue'
  if (isApiError(error)) {
    const { content } = error as { content: { code: string; message: string } }
    if (content?.code && content.message) {
      message = content.message
    }
  }
  return message
}

export function isAPIExceptionCapturedAsInfo(statusCode: number) {
  return Boolean(statusCode === 401)
}

const notCapturedStatusCodes = [500, 502, 503, 504]

export function isAPIExceptionNotCaptured(statusCode: number) {
  return notCapturedStatusCodes.includes(statusCode)
}
