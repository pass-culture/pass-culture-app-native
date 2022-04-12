import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { env } from '../src/libs/environment/env'
import { OFFER_RESPONSE_SNAP, VENUE_RESPONSE_SNAP, VENUE_RESPONSE_ALTERNATIVE_SNAP } from './constants'

export const server = setupServer(
  // offer
  rest.get(
    `${env.API_BASE_URL}/${env.API_BASE_PATH_NATIVE_V1}/offer/${OFFER_RESPONSE_SNAP.id}`,
    (req, res, ctx) => res(ctx.status(200), ctx.json(OFFER_RESPONSE_SNAP))
  ),
  // 404 offer
  rest.get(
    `${env.API_BASE_URL}/${env.API_BASE_PATH_NATIVE_V1}/offer/0`,
    (req, res, ctx) => res(ctx.status(404))
  ),
  // venue
  rest.get(
    `${env.API_BASE_URL}/${env.API_BASE_PATH_NATIVE_V1}/venue/${VENUE_RESPONSE_SNAP.id}`,
    (req, res, ctx) => res(ctx.status(200), ctx.json(VENUE_RESPONSE_SNAP))
  ),
  // venue alternative
  rest.get(
    `${env.API_BASE_URL}/${env.API_BASE_PATH_NATIVE_V1}/venue/${VENUE_RESPONSE_ALTERNATIVE_SNAP.id}`,
    (req, res, ctx) => res(ctx.status(200), ctx.json(VENUE_RESPONSE_ALTERNATIVE_SNAP))
  ),
)
