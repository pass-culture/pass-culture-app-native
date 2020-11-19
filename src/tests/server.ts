import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { ProtectedRouteResponse } from 'libs/api'
import { env } from 'libs/environment'
import { PasswordResetRequestRequest, SigninRequest, SigninResponse } from 'libs/swagger-codegen'

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
  rest.get<void, ProtectedRouteResponse>(
    env.API_BASE_URL + '/native/v1/protected',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ logged_in_as: 'john.doe@passculture.app' }))
    }
  ),
  rest.post<PasswordResetRequestRequest>(
    env.API_BASE_URL + '/native/v1/request_password_reset',
    (req, res, ctx) => {
      return res(ctx.status(204))
    }
  )
)
