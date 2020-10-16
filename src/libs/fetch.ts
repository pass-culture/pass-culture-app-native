import { t } from '@lingui/macro'
import CookieManager from '@react-native-community/cookies'
import { Alert } from 'react-native'

import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { getCookie, setCookieFromResponse } from 'libs/storage'

export async function post<Body>(url: string, request: RequestInit): Promise<Body> {
  request.method = 'POST'
  request.body = JSON.stringify(request.body)
  return makeRequest<Body>(url, request)
}

async function makeRequest<Body>(url: string, request: RequestInit): Promise<Body> {
  await CookieManager.clearAll() // clear cookies stored natively before each request
  const cookie = await getCookie()
  const config = {
    ...request,
    headers: {
      cookie: cookie || '',
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
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

  try {
    setCookieFromResponse(response)
  } catch (err) {
    Alert.alert(_(t`Échec dans la récupération du cookie: ${err}`))
  }
  const json = await response.json()
  return json
}

export class NotAuthenticatedError extends Error {
  constructor() {
    super(_(/*i18n: Authentication error message */ t`Erreur d'authentification`))
  }
}
