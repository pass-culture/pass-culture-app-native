import { rest } from 'msw'
import { setupServer } from 'msw/node'

import {
  ActivityTypesResponse,
  PhoneValidationRemainingAttemptsRequest,
  Reason,
  UserReportedOffersResponse,
} from 'api/gen'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import { env } from 'libs/environment'

export const server = setupServer(
  rest.get<UserReportedOffersResponse>(
    env.API_BASE_URL + '/native/v1/offers/reports',
    (_req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          reportedOffers: [
            { offerId: 1234, reason: Reason.INAPPROPRIATE, reportedAt: '123456789' },
          ],
        })
      )
  ),
  rest.get<PhoneValidationRemainingAttemptsRequest>(
    env.API_BASE_URL + '/native/v1/phone_validation/remaining_attempts',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          remainingAttempts: 5,
          counterResetDatetime: 'time',
        })
      )
    }
  ),
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
