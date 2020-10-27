import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { env } from 'libs/environment'

export const server = setupServer(
  rest.post(env.API_BASE_URL + '/users/signin', async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        canBookFreeOffers: true,
        dateCreated: '2020-10-12T14:44:14.063100Z',
        departementCode: '44',
        email: 'pctest.jeune93.has-booked-some@btmx.fr',
        firstName: 'PC Test Jeune',
        hasOffers: false,
        hasPhysicalVenues: false,
        id: 'FY',
        isAdmin: false,
        lastName: '93 HBS',
        needsToFillCulturalSurvey: false,
        postalCode: '93100',
        publicName: 'PC Test Jeune 93 HBS',
      })
    )
  })
)
