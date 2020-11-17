import { t } from '@lingui/macro'

import { env } from 'libs/environment'
import { _ } from 'libs/i18n'

import { getAccessToken } from './storage'

export type RequestCredentials = 'omit' | 'same-origin' | 'include' | undefined

export type EmptyResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in any]: never
}

export async function post<ResponseBody>(
  url: string,
  request: RequestInit
): Promise<ResponseBody | EmptyResponse> {
  request.method = 'POST'
  request.body = JSON.stringify(request.body)
  return makeRequest<ResponseBody | EmptyResponse>(env.API_BASE_URL + url, request)
}

export async function get<ResponseBody>(
  url: string,
  request: RequestInit = {}
): Promise<ResponseBody> {
  request.method = 'GET'
  return makeRequest<ResponseBody>(env.API_BASE_URL + url, request)
}

export async function getExternal<ResponseBody>(
  url: string,
  request: RequestInit = {}
): Promise<ResponseBody> {
  request.method = 'GET'
  return makeExternalRequest<ResponseBody>(url, request)
}

async function makeRequest<ResponseBody>(
  url: string,
  request: RequestInit
): Promise<ResponseBody | EmptyResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  if (request.credentials !== 'omit') {
    const accessToken = await getAccessToken()
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const config = {
    ...request,
    headers,
  }

  const response = await fetch(url, config)

  if (response.status === 401) {
    throw new NotAuthenticatedError()
  }
  if (!response.ok) {
    throw new Error(_(t`Échec de la requête ${url}, code: ${response.status}`))
  }

  if (response.status === 204) {
    return {}
  }

  const json = response.json()
  return json
}

async function makeExternalRequest<ResponseBody>(
  url: string,
  request: RequestInit
): Promise<ResponseBody> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  const config = {
    ...request,
    headers,
  }

  const response = await fetch(url, config)

  if (response.status === 401) {
    throw new NotAuthenticatedError()
  }
  if (!response.ok) {
    throw new Error(_(t`Échec de la requête ${url}, code: ${response.status}`))
  }

  const json = await response.json()
  return json
}

export class NotAuthenticatedError extends Error {
  constructor() {
    super(_(/*i18n: Authentication error message */ t`Erreur d'authentification`))
  }
}
