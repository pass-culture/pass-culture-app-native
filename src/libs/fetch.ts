import { t } from '@lingui/macro'
import CookieManager from '@react-native-community/cookies'

import { env } from 'libs/environment'
import { _ } from 'libs/i18n'

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

async function makeRequest<Body>(url: string, request: RequestInit): Promise<Body> {
  const config = {
    credentials: 'include' as RequestCredentials,
    ...request,
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  }

  // If cookie authentication is required check cookie existence or fail
  const localCookie = await CookieManager.get(env.API_BASE_URL)
  if (!localCookie.session && config.credentials !== 'omit') {
    throw Error(_(/*i18n setCookieFromResponse error */ t`La réponse ne contient pas de cookie`))
  }

  const response = await fetch(env.API_BASE_URL + url, config)

  if (!response.ok) {
    if (response.status === 401) {
      throw new NotAuthenticatedError()
    }
    throw new Error(
      _(/*i18n: Http error message */ t`Échec de la requête ${url}, code: ${response.status}`)
    )
  }

  // refresh cookie in CookieManager
  const cookie = response.headers.get('set-cookie')
  if (cookie) {
    CookieManager.setFromResponse(env.API_BASE_URL, cookie)
  }

  const json = await response.json()
  return json
}

export class NotAuthenticatedError extends Error {
  constructor() {
    super(_(/*i18n: Authentication error message */ t`Erreur d'authentification`))
  }
}
