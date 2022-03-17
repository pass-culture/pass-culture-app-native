import fetch, { Headers } from 'cross-fetch'

import { env } from '../libs/environment/env'

import { ENTITY_MAP, EntityKeys } from './entities/types'

const { API_BASE_URL, API_BASE_PATH_NATIVE_V1 } = env

const { href } = new URL(API_BASE_URL)

export async function apiClient(type: EntityKeys, id: number) {
  const entityValue = ENTITY_MAP[type]
  if (!entityValue) {
    throw Error(`Unknown entity: ${type}`)
  }

  const url = `${href}${API_BASE_PATH_NATIVE_V1}/${entityValue.NAME}/${id}`

  const response = await fetch(url, {
    headers: new Headers({
      'cache-control': 'public,max-age=3600',
    }),
  })
  if (response.ok && response.status === 200) {
    return response.json()
  }
  throw Error(`Wrong status code: ${response.status}`)
}
