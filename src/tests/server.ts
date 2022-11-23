import { rest } from 'msw'
import { setupServer } from 'msw/node'

import {
  AccountState,
  BookingsResponse,
  CulturalSurveyRequest,
  NextSubscriptionStepResponse,
  OfferResponse,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  SendPhoneValidationRequest,
  SettingsResponse,
  SigninRequest,
  SigninResponse,
  UserProfileResponse,
  ValidateEmailRequest,
  ValidateEmailResponse,
  VenueResponse,
} from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'

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
    res(
      ctx.status(200),
      ctx.json({
        email: 'email@domain.ext',
        firstName: 'Jean',
        isBeneficiary: true,
      })
    )
  ),
  rest.get<OfferResponse>(
    env.API_BASE_URL + '/native/v1/offer/' + offerResponseSnap.id,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(offerResponseSnap))
  ),
  rest.get<VenueResponse>(
    env.API_BASE_URL + '/native/v1/venue/' + venueResponseSnap.id,
    (_req, res, ctx) => res(ctx.status(200), ctx.json(venueResponseSnap))
  ),
  rest.post<CulturalSurveyRequest, EmptyResponse>(
    env.API_BASE_URL + '/native/v1/me/cultural_survey',
    (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}))
    }
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

export function requestPasswordResetFail() {
  return rest.post<RequestPasswordResetRequest, EmptyResponse>(
    env.API_BASE_URL + '/native/v1/request_password_reset',
    (_req, res, ctx) => {
      return res(ctx.status(400), ctx.json({}))
    }
  )
}

function requestSettingsSuccess(
  settingsResponse: SettingsResponse = {
    accountCreationMinimumAge: 15,
    accountUnsuspensionLimit: 60,
    appEnableAutocomplete: true,
    appEnableCookiesV2: true,
    disableStoreReview: false,
    displayDmsRedirection: true,
    enableFrontImageResizing: false,
    enableNativeCulturalSurvey: false,
    enableNativeIdCheckVerboseDebugging: false,
    enableNewIdentificationFlow: false,
    enablePhoneValidation: false,
    idCheckAddressAutocompletion: true,
    isRecaptchaEnabled: true,
    objectStorageUrl: 'https://localhost',
    proDisableEventsQrcode: false,
  }
) {
  return rest.get<SettingsResponse>(env.API_BASE_URL + '/native/v1/settings', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(settingsResponse))
  })
}
