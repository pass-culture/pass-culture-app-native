import { t } from '@lingui/macro'

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
    throw new Error(
      t({
        id: 'request error',
        values: { url, status: response.status },
        message: 'Échec de la requête {url}, code: {status}',
      })
    )
  }

  const json = await response.json()
  return json
}

export class NotAuthenticatedError extends Error {
  constructor() {
    super(t`Erreur d'authentification`)
  }
}

export class FailedToRefreshAccessTokenError extends Error {
  constructor() {
    super(t`Erreur lors de la récupération du token d'accès`)
  }
}
