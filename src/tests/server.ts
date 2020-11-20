import { rest } from 'msw'
import { setupServer } from 'msw/node'

import {
  CurrentUserResponse,
  PasswordResetBody,
  ResetPasswordBody,
  SigninBody,
  SigninResponse,
} from 'features/auth/api.types'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'

export const server = setupServer(
  rest.post<SigninBody, SigninResponse>(env.API_BASE_URL + '/native/v1/signin', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ access_token: 'access_token', refresh_token: 'refresh_token' })
    )
  }),
  rest.get<void, CurrentUserResponse>(
    env.API_BASE_URL + '/native/v1/protected',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ logged_in_as: 'john.doe@passculture.app' }))
    }
  ),
  rest.post<PasswordResetBody, EmptyResponse>(
    env.API_BASE_URL + '/native/v1/request_password_reset',
    (req, res, ctx) => {
      return res(ctx.status(204))
    }
  ),
  rest.post<ResetPasswordBody, EmptyResponse>(
    env.API_BASE_URL + '/native/v1/reset_password',
    (req, res, ctx) => {
      return res(ctx.status(204))
    }
  )
)
