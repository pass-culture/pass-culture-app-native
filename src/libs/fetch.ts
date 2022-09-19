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
    headers: headers,
  }

  const response = await fetch(url, config)

  if (response.status === 401) {
    throw new NotAuthenticatedError()
  }

  if (!response.ok) {
    throw new Error(`Échec de la requête ${url}, code: ${response.status}`)
  }

  return await response.json()
}

class NotAuthenticatedError extends Error {
  constructor() {
    super(`Erreur d'authentification`)
  }
}
