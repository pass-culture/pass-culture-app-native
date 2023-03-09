import { rest } from 'msw'

import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { server } from 'tests/server'

jest.unmock('libs/firebase/analytics/analytics')
jest.unmock('libs/firebase/analytics/provider')

server.use(
  rest.get(
    `https://firebase.googleapis.com/v1alpha/projects/-/apps/${env.FIREBASE_APPID}/webConfig`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json({}))
  )
)

describe('analytics - getAppInstanceId', () => {
  it('should be null', async () => {
    expect(await analytics.getAppInstanceId()).toBeNull()
  })
})
