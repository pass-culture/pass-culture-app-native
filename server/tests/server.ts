import { http } from 'msw'
import { setupServer } from 'msw/node'

import { env } from '../src/libs/environment/env'

import {
  OFFER_RESPONSE_SNAPSHOT,
  VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT,
  VENUE_WITH_BANNER_RESPONSE_SNAPSHOT,
} from './constants'

export const server = setupServer(
  // offer
  http.get(
    `${env.API_BASE_URL}/${env.API_BASE_PATH_NATIVE_V1}/offer/${OFFER_RESPONSE_SNAPSHOT.id}`,
    () =>
      new Response(JSON.stringify(OFFER_RESPONSE_SNAPSHOT), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      })
  ),

  // 404 offer
  http.get(
    `${env.API_BASE_URL}/${env.API_BASE_PATH_NATIVE_V1}/offer/0`,
    () =>
      new Response(JSON.stringify({}), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      })
  ),
  // 502 offer
  http.get(
    `${env.API_BASE_URL}/${env.API_BASE_PATH_NATIVE_V1}/offer/502`,
    () =>
      new Response(undefined, {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 502,
      })
  ),
  // venue
  http.get(
    `${env.API_BASE_URL}/${env.API_BASE_PATH_NATIVE_V1}/venue/${VENUE_WITH_BANNER_RESPONSE_SNAPSHOT.id}`,
    () =>
      new Response(JSON.stringify(VENUE_WITH_BANNER_RESPONSE_SNAPSHOT), {
        status: 200,
      })
  ),
  // venue alternative
  http.get(
    `${env.API_BASE_URL}/${env.API_BASE_PATH_NATIVE_V1}/venue/${VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT.id}`,
    () =>
      new Response(JSON.stringify(VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT), {
        headers: {
          'Content-Type': 'application/json',
        },
        status: 200,
      })
  )
)
