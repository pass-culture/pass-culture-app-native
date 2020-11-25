import { t } from '@lingui/macro'

import { _ } from 'libs/i18n'

export type RequestCredentials = 'omit' | 'same-origin' | 'include' | undefined

export type Headers = {
  Accept?: string
  'Content-Type'?: string
  Authorization?: string
}

export type EmptyResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in any]: never
}

export async function getExternal<ResponseBody>(
  url: string,
  request: RequestInit = {}
): Promise<ResponseBody> {
  request.method = 'GET'
  return makeExternalRequest<ResponseBody>(url, request)
}

async function makeExternalRequest<ResponseBody>(
  url: string,
  request: RequestInit
): Promise<ResponseBody> {
  const headers: Headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  const config = {
    ...request,
    headers: headers as HeadersInit_,
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
