import { rest } from 'msw'
import { setupServer } from 'msw/node'

import {
  ActivityTypesResponse,
  BannerResponse,
  CookieConsentRequest,
  FavoriteResponse,
  NextSubscriptionStepResponse,
  PhoneValidationRemainingAttemptsRequest,
  Reason,
  SubscriptionStepperResponse,
  UserReportedOffersResponse,
} from 'api/gen'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { SubscriptionStepperResponseFixture } from 'features/identityCheck/pages/helpers/stepperInfo.fixture'
import { ActivityTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedActivityTypes'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { homepageEntriesAPIResponse } from 'libs/contentful/fixtures/homepageEntriesAPIResponse'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'

export const server = setupServer(
  rest.get<NextSubscriptionStepResponse>(
    env.API_BASE_URL + '/native/v1/subscription/next_step',
    (_req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          nextSubscriptionStep: null,
        })
      )
  ),
  rest.get<SubscriptionStepperResponse>(
    env.API_BASE_URL + '/native/v1/subscription/stepper',
    (_req, res, ctx) => res(ctx.status(200), ctx.json(SubscriptionStepperResponseFixture))
  ),
  rest.get<Array<FavoriteResponse>>(
    `${env.API_BASE_URL}/native/v1/me/favorites`,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(paginatedFavoritesResponseSnap))
  ),
  rest.post<CookieConsentRequest, EmptyResponse>(
    env.API_BASE_URL + '/native/v1/cookies_consent',
    (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}))
    }
  ),
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
  ),
  rest.get(`${CONTENTFUL_BASE_URL}/entries`, async (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(homepageEntriesAPIResponse))
  }),
  rest.get<BannerResponse>(env.API_BASE_URL + '/native/v1/banner', (_req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  )
)
