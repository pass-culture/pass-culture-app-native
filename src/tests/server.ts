import { rest } from 'msw'
import { setupServer } from 'msw/node'

import {
  PasswordResetRequestRequest,
  ResetPasswordRequest,
  SigninRequest,
  SigninResponse,
  UserProfileResponse,
} from 'api/gen'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'

export const server = setupServer(
  rest.post<SigninRequest, SigninResponse>(
    env.API_BASE_URL + '/native/v1/signin',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ access_token: 'access_token', refresh_token: 'refresh_token' })
      )
    }
  ),
  rest.post<PasswordResetRequestRequest, EmptyResponse>(
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
    res(ctx.status(200), ctx.json({ email: 'email@domain.ext', first_name: 'Jean' }))
  )
)
