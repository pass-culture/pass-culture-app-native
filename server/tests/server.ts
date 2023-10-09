import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { env } from '../src/libs/environment/env'

import {
  OFFER_RESPONSE_SNAPSHOT,
  VENUE_WITH_BANNER_RESPONSE_SNAPSHOT,
  VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT,
} from './constants'

export const server = setupServer(
  // offer
  rest.get(
    `${env.API_BASE_URL}/${env.API_BASE_PATH_NATIVE_V1}/offer/${OFFER_RESPONSE_SNAPSHOT.id}`,
    (req, res, ctx) => res(ctx.status(200), ctx.json(OFFER_RESPONSE_SNAPSHOT))
  ),
  // 404 offer
  rest.get(`${env.API_BASE_URL}/${env.API_BASE_PATH_NATIVE_V1}/offer/0`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),
  // 502 offer
  rest.get(`${env.API_BASE_URL}/${env.API_BASE_PATH_NATIVE_V1}/offer/502`, (req, res, ctx) =>
    res(ctx.status(502))
  ),
  // venue
  rest.get(
    `${env.API_BASE_URL}/${env.API_BASE_PATH_NATIVE_V1}/venue/${VENUE_WITH_BANNER_RESPONSE_SNAPSHOT.id}`,
    (req, res, ctx) => res(ctx.status(200), ctx.json(VENUE_WITH_BANNER_RESPONSE_SNAPSHOT))
  ),
  // venue alternative
  rest.get(
    `${env.API_BASE_URL}/${env.API_BASE_PATH_NATIVE_V1}/venue/${VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT.id}`,
    (req, res, ctx) => res(ctx.status(200), ctx.json(VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT))
  )
)
