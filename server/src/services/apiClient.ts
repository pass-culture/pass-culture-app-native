import fetch, { Headers } from 'cross-fetch'

import { env } from '../libs/environment/env'

import { ENTITY_MAP, EntityKeys } from './entities/types'

export async function apiClient(type: EntityKeys, id: number) {
  const { API_BASE_URL, API_BASE_PATH_NATIVE_V1, PROXY_CACHE_CONTROL } = env

  const { href } = new URL(API_BASE_URL)
  const entityValue = ENTITY_MAP[type]
  if (!entityValue) {
    throw new Error(`Unknown entity: ${type}`)
  }

  const url = `${href}${API_BASE_PATH_NATIVE_V1}/${entityValue.API_MODEL_NAME}/${id}`

  const response = await fetch(url, {
    headers: new Headers({
      'cache-control': PROXY_CACHE_CONTROL,
    }),
  })

  if (response.status === 200) {
    return response.json()
  }

  throw new Error(`Wrong status code: ${response.status}`)
}
