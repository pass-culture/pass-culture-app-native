import { rest } from 'msw'
import { setupServer } from 'msw/node'

import {
  AccountState,
  BannerResponse,
  BookingsResponse,
  CookieConsentRequest,
  FavoriteResponse,
  NextSubscriptionStepResponse,
  OfferResponse,
  PhoneValidationRemainingAttemptsRequest,
  ProfileOptionsResponse,
  Reason,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  SendPhoneValidationRequest,
  SettingsResponse,
  SigninRequest,
  SigninResponse,
  SubcategoriesResponseModelv2,
  SubscriptionStepperResponse,
  UserProfileResponse,
  UserReportedOffersResponse,
  ValidateEmailRequest,
  ValidateEmailResponse,
  VenueResponse,
} from 'api/gen'
import { mockDefaultSettings } from 'features/auth/context/__mocks__/SettingsContext'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { SubscriptionStepperResponseFixture } from 'features/identityCheck/pages/helpers/stepperInfo.fixture'
import { SchoolTypesSnap } from 'features/identityCheck/pages/profile/fixtures/mockedSchoolTypes'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { beneficiaryUser } from 'fixtures/user'
import { BASE_URL } from 'libs/contentful/fetchHomepageNatifContent'
import { homepageEntriesAPIResponse } from 'libs/contentful/fixtures/homepageEntriesAPIResponse'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { placeholderData } from 'libs/subcategories/placeholderData'

export const server = setupServer(
  rest.post<SigninRequest, SigninResponse>(
    env.API_BASE_URL + '/native/v1/signin',
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
          accountState: AccountState.ACTIVE as AccountState,
        })
      )
    }
  ),
  requestPasswordResetSuccess(),
  requestSettingsSuccess(),
  rest.post<ResetPasswordRequest, EmptyResponse>(
    env.API_BASE_URL + '/native/v1/reset_password',
    (_req, res, ctx) => {
      return res(ctx.status(204))
    }
  ),
  rest.post<ResetPasswordRequest, EmptyResponse>(
    env.API_BASE_URL + '/native/v1/resend_email_validation',
    (_req, res, ctx) => {
      return res(ctx.status(204))
    }
  ),
  rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(beneficiaryUser))
  ),
  rest.get<OfferResponse>(
    env.API_BASE_URL + '/native/v1/offer/' + offerResponseSnap.id,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(offerResponseSnap))
  ),
  rest.get<VenueResponse>(
    env.API_BASE_URL + '/native/v1/venue/' + venueResponseSnap.id,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(venueResponseSnap))
  ),
  rest.get<BookingsResponse>(env.API_BASE_URL + '/native/v1/bookings', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(bookingsSnap))
  }),
  rest.post<SendPhoneValidationRequest, EmptyResponse>(
    env.API_BASE_URL + '/native/v1/send_phone_validation_code',
    (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}))
    }
  ),
  rest.post<ValidateEmailRequest, ValidateEmailResponse>(
    env.API_BASE_URL + '/native/v1/validate_email',
    (_req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
        })
      )
  ),
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
  rest.get<SubcategoriesResponseModelv2>(
    env.API_BASE_URL + '/native/v1/subcategories/v2',
    (_req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          ...placeholderData,
        })
      )
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
  rest.get<ProfileOptionsResponse>(
    env.API_BASE_URL + '/native/v1/subscription/profile_options',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          activities: SchoolTypesSnap.activities,
          school_types: SchoolTypesSnap.school_types,
        })
      )
    }
  ),
  rest.get(`${BASE_URL}/entries`, async (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(homepageEntriesAPIResponse))
  }),
  rest.get<BannerResponse>(env.API_BASE_URL + '/native/v1/banner', (_req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  )
)

export function requestPasswordResetSuccess() {
  return rest.post<RequestPasswordResetRequest, EmptyResponse>(
    env.API_BASE_URL + '/native/v1/request_password_reset',
    (_req, res, ctx) => {
      return res(ctx.status(204))
    }
  )
}

export function requestPasswordResetFail(errorCode?: number) {
  return rest.post<RequestPasswordResetRequest, EmptyResponse>(
    env.API_BASE_URL + '/native/v1/request_password_reset',
    (_req, res, ctx) => {
      return res(ctx.status(errorCode ?? 400), ctx.json({}))
    }
  )
}

function requestSettingsSuccess(settingsResponse: SettingsResponse = mockDefaultSettings) {
  return rest.get<SettingsResponse>(env.API_BASE_URL + '/native/v1/settings', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(settingsResponse))
  })
}
