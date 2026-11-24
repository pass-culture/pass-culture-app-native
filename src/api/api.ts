import { navigateFromRef } from 'features/navigation/navigationRef'
import { env } from 'libs/environment/env'
import { eventMonitoring } from 'libs/monitoring/services'
import { storage } from 'libs/storage'

import { ApiError } from './ApiError'
import { safeFetch , createNeedsAuthenticationResponse } from './apiHelpers'
import { client } from './hey-api-gen/client.gen'
import { nativeApi } from './nativeApi.gen'

client.setConfig({
  baseUrl: env.API_BASE_URL,
  auth: async () => (await storage.readString('access_token')) ?? undefined,
  fetch: (input, init) => safeFetch(input, init ?? {}, nativeApi),
  responseStyle: 'data',
  throwOnError: true,
})

const emptyResponse = () =>
  new Response('{}', {
    headers: { 'content-type': 'application/json' },
    status: 200,
  })

client.interceptors.response.use(async (response, request, options) => {
  if (response.status === 403 && response.headers.get('x-country-ban')) {
    navigateFromRef('BannedCountryError')
    return emptyResponse()
  }

  if (
    response.status === 401 &&
    response.statusText === createNeedsAuthenticationResponse('').statusText
  ) {
    navigateFromRef('LoginMethods')
    return emptyResponse()
  }

  if (response.status === 401) {
    const responseBody = await response.clone().text()
    eventMonitoring.captureException(new Error('handleGeneratedApiResponse'), {
      extra: { responseBody },
    })
    if (options.credentials !== 'omit') {
      navigateFromRef('LoginMethods')
      return emptyResponse()
    }
  }

  return response
})

client.interceptors.error.use((error, response, request) => {
  if (!response || !request) return error

  return new ApiError(
    response.status,
    error,
    `Échec de la requête ${request.url}, code: ${response.status}`
  )
})

export const api = nativeApi
