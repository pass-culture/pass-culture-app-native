import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { env } from '../src/libs/environment/serverEnv'

import {
  OFFER_RESPONSE_SNAPSHOT,
  VENUE_WITH_BANNER_RESPONSE_SNAPSHOT,
  VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT,
} from './constants'

export const server = setupServer(
  // offer
  http.get(`${env.API_BASE_URL}/native/v3/offer/${OFFER_RESPONSE_SNAPSHOT.id}`, () =>
    HttpResponse.json(OFFER_RESPONSE_SNAPSHOT)
  ),
  // 404 offer
  http.get(`${env.API_BASE_URL}/native/v3/offer/0`, () => HttpResponse.json({})),
  // 502 offer
  http.get(
    `${env.API_BASE_URL}/native/v3/offer/502`,
    () => new HttpResponse(null, { status: 502 })
  ),
  // venue
  http.get(`${env.API_BASE_URL}/native/v2/venue/${VENUE_WITH_BANNER_RESPONSE_SNAPSHOT.id}`, () =>
    HttpResponse.json(VENUE_WITH_BANNER_RESPONSE_SNAPSHOT)
  ),
  // venue alternative
  http.get(`${env.API_BASE_URL}/native/v2/venue/${VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT.id}`, () =>
    HttpResponse.json(VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT)
  )
)
