import { t } from '@lingui/macro'

import { env } from 'libs/environment'
import { _ } from 'libs/i18n'

import { getToken } from './storage'

export type RequestCredentials = 'omit' | 'same-origin' | 'include' | undefined

export async function post<Body>(url: string, request: RequestInit): Promise<Body> {
  request.method = 'POST'
  request.body = JSON.stringify(request.body)
  return makeRequest<Body>(url, request)
}

export async function get<Body>(url: string, request: RequestInit = {}): Promise<Body> {
  request.method = 'GET'
  return makeRequest<Body>(url, request)
}

export async function getExternal<Body>(
  apiBaseUrl: string,
  url: string,
  request: RequestInit = {}
): Promise<Body> {
  request.method = 'GET'
  return makeRequest<Body>(url, request, apiBaseUrl)
}

async function makeRequest<Body>(
  url: string,
  request: RequestInit,
  apiBaseUrl: string | null = null
): Promise<Body> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  if (request.credentials !== 'omit') {
    const token = await getToken()
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...request,
    headers,
  }

  const baseUrl = apiBaseUrl || env.API_BASE_URL

  const response = await fetch(baseUrl + url, config)

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
