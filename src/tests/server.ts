import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { CurrentUserResponse, SigninBody, SigninResponse } from 'features/auth/api'
import { env } from 'libs/environment'

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
  )
)
