import { rest } from 'msw'
import { setupServer } from 'msw/node'

import {
  OfferResponse,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  SigninRequest,
  SigninResponse,
  UserProfileResponse,
} from 'api/gen'
import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
export const server = setupServer(
  rest.post<SigninRequest, SigninResponse>(
    env.API_BASE_URL + '/native/v1/signin',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ accessToken: 'access_token', refreshToken: 'refresh_token' })
      )
    }
  ),
  rest.post<RequestPasswordResetRequest, EmptyResponse>(
    env.API_BASE_URL + '/native/v1/request_password_reset',
    (req, res, ctx) => {
      return res(ctx.status(204))
    }
  ),
  rest.post<ResetPasswordRequest, EmptyResponse>(
    env.API_BASE_URL + '/native/v1/reset_password',
    (req, res, ctx) => {
      return res(ctx.status(204))
    }
  ),
  rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({ email: 'email@domain.ext', firstName: 'Jean', isBeneficiary: true })
    )
  ),
  rest.get<OfferResponse>(
    env.API_BASE_URL + '/native/v1/offer/' + offerResponseSnap.id,
    (req, res, ctx) => res(ctx.status(200), ctx.json(offerResponseSnap))
  )
)
