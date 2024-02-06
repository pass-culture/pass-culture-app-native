import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { ActivityTypesResponse } from 'api/gen'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import { env } from 'libs/environment'

export const server = setupServer(
  rest.get<ActivityTypesResponse>(
    env.API_BASE_URL + '/native/v1/subscription/activity_types',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          activities: ActivityTypesSnap.activities,
        })
      )
    }
  )
)
