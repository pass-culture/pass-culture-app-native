// This file is auto-generated from the native OpenAPI schema.

import type { LegacyApiSignatures } from './gen/models.gen'
import * as sdk from './hey-api-gen/sdk.gen'
import type { Options } from './hey-api-gen/sdk.gen'
import type * as ApiTypes from './hey-api-gen/types.gen'

export const postNativeV1Account = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1Account']>
): ReturnType<LegacyApiSignatures['postNativeV1Account']> => {
  const [body, options] = args
  return sdk.postNativeV1Account({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1Account']>
}

export const postNativeV1AccountAnonymize = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1AccountAnonymize']>
): ReturnType<LegacyApiSignatures['postNativeV1AccountAnonymize']> => {
  const [options] = args
  return sdk.postNativeV1AccountAnonymize({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1AccountAnonymize']>
}

export const postNativeV1AccountSuspend = (
  options: Omit<
    Options<ApiTypes.postNativeV1AccountSuspendData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.postNativeV1AccountSuspendResponse> => {
  return sdk.postNativeV1AccountSuspend({
    ...options,
    credentials: options.credentials ?? 'include',
  })
}

export const getNativeV1AccountSuspendTokenValidationtoken = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1AccountSuspendTokenValidationtoken']>
): ReturnType<LegacyApiSignatures['getNativeV1AccountSuspendTokenValidationtoken']> => {
  const [token, options] = args
  return sdk.getNativeV1AccountSuspendTokenValidationToken({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    path: { token: token },
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1AccountSuspendTokenValidationtoken']>
}

export const postNativeV1AccountSuspendForHackSuspicion = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1AccountSuspendForHackSuspicion']>
): ReturnType<LegacyApiSignatures['postNativeV1AccountSuspendForHackSuspicion']> => {
  const [options] = args
  return sdk.postNativeV1AccountSuspendForHackSuspicion({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1AccountSuspendForHackSuspicion']>
}

export const postNativeV1AccountSuspendForSuspiciousLogin = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1AccountSuspendForSuspiciousLogin']>
): ReturnType<LegacyApiSignatures['postNativeV1AccountSuspendForSuspiciousLogin']> => {
  const [body, options] = args
  return sdk.postNativeV1AccountSuspendForSuspiciousLogin({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1AccountSuspendForSuspiciousLogin']>
}

export const getNativeV1AccountSuspensionDate = (
  options: Omit<
    Options<ApiTypes.getNativeV1AccountSuspensionDateData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.getNativeV1AccountSuspensionDateResponse> => {
  return sdk.getNativeV1AccountSuspensionDate({
    ...options,
    credentials: options.credentials ?? 'include',
  })
}

export const getNativeV1AccountSuspensionStatus = (
  options: Omit<
    Options<ApiTypes.getNativeV1AccountSuspensionStatusData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.getNativeV1AccountSuspensionStatusResponse> => {
  return sdk.getNativeV1AccountSuspensionStatus({
    ...options,
    credentials: options.credentials ?? 'include',
  })
}

export const postNativeV1AccountUnsuspend = (
  options: Omit<
    Options<ApiTypes.postNativeV1AccountUnsuspendData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.postNativeV1AccountUnsuspendResponse> => {
  return sdk.postNativeV1AccountUnsuspend({
    ...options,
    credentials: options.credentials ?? 'include',
  })
}

export const postNativeV1AchievementsMarkAsSeen = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1AchievementsMarkAsSeen']>
): ReturnType<LegacyApiSignatures['postNativeV1AchievementsMarkAsSeen']> => {
  const [body, options] = args
  return sdk.postNativeV1AchievementsMarkAsSeen({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1AchievementsMarkAsSeen']>
}

export const getNativeV1ArtistsartistId = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1ArtistsartistId']>
): ReturnType<LegacyApiSignatures['getNativeV1ArtistsartistId']> => {
  const [artist_id, options] = args
  return sdk.getNativeV1ArtistsArtistId({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    path: { artist_id: artist_id },
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1ArtistsartistId']>
}

export const getNativeV1ArtistsartistIdSimilar = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1ArtistsartistIdSimilar']>
): ReturnType<LegacyApiSignatures['getNativeV1ArtistsartistIdSimilar']> => {
  const [artist_id, options] = args
  return sdk.getNativeV1ArtistsArtistIdSimilar({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    path: { artist_id: artist_id },
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1ArtistsartistIdSimilar']>
}

export const getNativeV1Banner = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1Banner']>
): ReturnType<LegacyApiSignatures['getNativeV1Banner']> => {
  const [isGeolocated, options] = args
  return sdk.getNativeV1Banner({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    query: { isGeolocated: isGeolocated },
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1Banner']>
}

export const getNativeV1Bookings = (
  options: Omit<Options<ApiTypes.getNativeV1BookingsData, true>, 'body' | 'path' | 'query'> = {}
): Promise<ApiTypes.getNativeV1BookingsResponse> => {
  return sdk.getNativeV1Bookings({ ...options, credentials: options.credentials ?? 'include' })
}

export const postNativeV1Bookings = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1Bookings']>
): ReturnType<LegacyApiSignatures['postNativeV1Bookings']> => {
  const [body, options] = args
  return sdk.postNativeV1Bookings({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1Bookings']>
}

export const postNativeV1BookingsbookingIdCancel = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1BookingsbookingIdCancel']>
): ReturnType<LegacyApiSignatures['postNativeV1BookingsbookingIdCancel']> => {
  const [booking_id, options] = args
  return sdk.postNativeV1BookingsBookingIdCancel({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    path: { booking_id: booking_id },
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1BookingsbookingIdCancel']>
}

export const postNativeV1BookingsbookingIdToggleDisplay = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1BookingsbookingIdToggleDisplay']>
): ReturnType<LegacyApiSignatures['postNativeV1BookingsbookingIdToggleDisplay']> => {
  const [body, booking_id, options] = args
  return sdk.postNativeV1BookingsBookingIdToggleDisplay({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
    path: { booking_id: booking_id },
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1BookingsbookingIdToggleDisplay']>
}

export const postNativeV1ChangePassword = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1ChangePassword']>
): ReturnType<LegacyApiSignatures['postNativeV1ChangePassword']> => {
  const [body, options] = args
  return sdk.postNativeV1ChangePassword({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1ChangePassword']>
}

export const postNativeV1CookiesConsent = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1CookiesConsent']>
): ReturnType<LegacyApiSignatures['postNativeV1CookiesConsent']> => {
  const [body, options] = args
  return sdk.postNativeV1CookiesConsent({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1CookiesConsent']>
}

export const getNativeV1Countries = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1Countries']>
): ReturnType<LegacyApiSignatures['getNativeV1Countries']> => {
  const [options] = args
  return sdk.getNativeV1Countries({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1Countries']>
}

export const postNativeV1CulturalSurveyAnswers = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1CulturalSurveyAnswers']>
): ReturnType<LegacyApiSignatures['postNativeV1CulturalSurveyAnswers']> => {
  const [body, options] = args
  return sdk.postNativeV1CulturalSurveyAnswers({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1CulturalSurveyAnswers']>
}

export const getNativeV1CulturalSurveyQuestions = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1CulturalSurveyQuestions']>
): ReturnType<LegacyApiSignatures['getNativeV1CulturalSurveyQuestions']> => {
  const [options] = args
  return sdk.getNativeV1CulturalSurveyQuestions({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1CulturalSurveyQuestions']>
}

export const getNativeV1EmailValidationRemainingResendsemail = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1EmailValidationRemainingResendsemail']>
): ReturnType<LegacyApiSignatures['getNativeV1EmailValidationRemainingResendsemail']> => {
  const [email, options] = args
  return sdk.getNativeV1EmailValidationRemainingResendsEmail({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    path: { email: email },
  }) as unknown as ReturnType<
    LegacyApiSignatures['getNativeV1EmailValidationRemainingResendsemail']
  >
}

export const postNativeV1Feedback = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1Feedback']>
): ReturnType<LegacyApiSignatures['postNativeV1Feedback']> => {
  const [body, options] = args
  return sdk.postNativeV1Feedback({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1Feedback']>
}

export const getNativeV1Me = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1Me']>
): ReturnType<LegacyApiSignatures['getNativeV1Me']> => {
  const [options] = args
  return sdk.getNativeV1Me({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1Me']>
}

export const getNativeV1MeFavorites = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1MeFavorites']>
): ReturnType<LegacyApiSignatures['getNativeV1MeFavorites']> => {
  const [options] = args
  return sdk.getNativeV1MeFavorites({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1MeFavorites']>
}

export const postNativeV1MeFavorites = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1MeFavorites']>
): ReturnType<LegacyApiSignatures['postNativeV1MeFavorites']> => {
  const [body, options] = args
  return sdk.postNativeV1MeFavorites({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1MeFavorites']>
}

export const deleteNativeV1MeFavoritesfavoriteId = (
  ...args: Parameters<LegacyApiSignatures['deleteNativeV1MeFavoritesfavoriteId']>
): ReturnType<LegacyApiSignatures['deleteNativeV1MeFavoritesfavoriteId']> => {
  const [favorite_id, options] = args
  return sdk.deleteNativeV1MeFavoritesFavoriteId({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    path: { favorite_id: favorite_id },
  }) as unknown as ReturnType<LegacyApiSignatures['deleteNativeV1MeFavoritesfavoriteId']>
}

export const getNativeV1MeReminders = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1MeReminders']>
): ReturnType<LegacyApiSignatures['getNativeV1MeReminders']> => {
  const [options] = args
  return sdk.getNativeV1MeReminders({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1MeReminders']>
}

export const postNativeV1MeReminders = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1MeReminders']>
): ReturnType<LegacyApiSignatures['postNativeV1MeReminders']> => {
  const [body, options] = args
  return sdk.postNativeV1MeReminders({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1MeReminders']>
}

export const deleteNativeV1MeRemindersreminderId = (
  ...args: Parameters<LegacyApiSignatures['deleteNativeV1MeRemindersreminderId']>
): ReturnType<LegacyApiSignatures['deleteNativeV1MeRemindersreminderId']> => {
  const [reminder_id, options] = args
  return sdk.deleteNativeV1MeRemindersReminderId({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    path: { reminder_id: reminder_id },
  }) as unknown as ReturnType<LegacyApiSignatures['deleteNativeV1MeRemindersreminderId']>
}

export const getNativeV1MovieCalendar = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1MovieCalendar']>
): ReturnType<LegacyApiSignatures['getNativeV1MovieCalendar']> => {
  const [latitude, longitude, allocineId, visa, aroundRadius, from, to, options] = args
  return sdk.getNativeV1MovieCalendar({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    query: {
      latitude: latitude,
      longitude: longitude,
      allocineId: allocineId,
      visa: visa,
      aroundRadius: aroundRadius,
      from: from,
      to: to,
    },
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1MovieCalendar']>
}

export const getNativeV1MovieCalendarMe = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1MovieCalendarMe']>
): ReturnType<LegacyApiSignatures['getNativeV1MovieCalendarMe']> => {
  const [latitude, longitude, allocineId, visa, aroundRadius, from, to, options] = args
  return sdk.getNativeV1MovieCalendarMe({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    query: {
      latitude: latitude,
      longitude: longitude,
      allocineId: allocineId,
      visa: visa,
      aroundRadius: aroundRadius,
      from: from,
      to: to,
    },
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1MovieCalendarMe']>
}

export const getNativeV1OauthState = (
  options: Omit<Options<ApiTypes.getNativeV1OauthStateData, true>, 'body' | 'path' | 'query'> = {}
): Promise<ApiTypes.getNativeV1OauthStateResponse> => {
  return sdk.getNativeV1OauthState({ ...options, credentials: options.credentials ?? 'omit' })
}

export const postNativeV1OauthssoProviderAccount = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1OauthssoProviderAccount']>
): ReturnType<LegacyApiSignatures['postNativeV1OauthssoProviderAccount']> => {
  const [body, sso_provider, options] = args
  return sdk.postNativeV1OauthSsoProviderAccount({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
    path: { sso_provider: sso_provider },
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1OauthssoProviderAccount']>
}

export const postNativeV1OauthssoProviderAuthorize = (
  body: ApiTypes.postNativeV1OauthSsoProviderAuthorizeData['body'],
  parameter0: NonNullable<
    ApiTypes.postNativeV1OauthSsoProviderAuthorizeData['path']
  >['sso_provider'],
  options: Omit<
    Options<ApiTypes.postNativeV1OauthSsoProviderAuthorizeData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.postNativeV1OauthSsoProviderAuthorizeResponse> => {
  return sdk.postNativeV1OauthSsoProviderAuthorize({
    ...options,
    credentials: options.credentials ?? 'omit',
    body,
    path: { sso_provider: parameter0 },
  })
}

export const getNativeV1OfferofferIdAdvices = (
  parameter0: NonNullable<ApiTypes.getNativeV1OfferOfferIdAdvicesData['path']>['offer_id'],
  parameter1?: NonNullable<
    ApiTypes.getNativeV1OfferOfferIdAdvicesData['query']
  >['maxContentLength'],
  parameter2?: NonNullable<ApiTypes.getNativeV1OfferOfferIdAdvicesData['query']>['page'],
  parameter3?: NonNullable<ApiTypes.getNativeV1OfferOfferIdAdvicesData['query']>['resultsPerPage'],
  parameter4?: NonNullable<ApiTypes.getNativeV1OfferOfferIdAdvicesData['query']>['latitude'],
  parameter5?: NonNullable<ApiTypes.getNativeV1OfferOfferIdAdvicesData['query']>['longitude'],
  options: Omit<
    Options<ApiTypes.getNativeV1OfferOfferIdAdvicesData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.getNativeV1OfferOfferIdAdvicesResponse> => {
  return sdk.getNativeV1OfferOfferIdAdvices({
    ...options,
    credentials: options.credentials ?? 'omit',
    path: { offer_id: parameter0 },
    query: {
      maxContentLength: parameter1,
      page: parameter2,
      resultsPerPage: parameter3,
      latitude: parameter4,
      longitude: parameter5,
    },
  })
}

export const getNativeV1OfferofferIdChronicles = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1OfferofferIdChronicles']>
): ReturnType<LegacyApiSignatures['getNativeV1OfferofferIdChronicles']> => {
  const [offer_id, options] = args
  return sdk.getNativeV1OfferOfferIdChronicles({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    path: { offer_id: offer_id },
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1OfferofferIdChronicles']>
}

export const patchNativeV1Profile = (
  ...args: Parameters<LegacyApiSignatures['patchNativeV1Profile']>
): ReturnType<LegacyApiSignatures['patchNativeV1Profile']> => {
  const [body, options] = args
  return sdk.patchNativeV1Profile({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['patchNativeV1Profile']>
}

export const postNativeV1ProfileEmailUpdateCancel = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1ProfileEmailUpdateCancel']>
): ReturnType<LegacyApiSignatures['postNativeV1ProfileEmailUpdateCancel']> => {
  const [body, options] = args
  return sdk.postNativeV1ProfileEmailUpdateCancel({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1ProfileEmailUpdateCancel']>
}

export const putNativeV1ProfileEmailUpdateValidate = (
  ...args: Parameters<LegacyApiSignatures['putNativeV1ProfileEmailUpdateValidate']>
): ReturnType<LegacyApiSignatures['putNativeV1ProfileEmailUpdateValidate']> => {
  const [body, options] = args
  return sdk.putNativeV1ProfileEmailUpdateValidate({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['putNativeV1ProfileEmailUpdateValidate']>
}

export const getNativeV1ProfileTokenExpiration = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1ProfileTokenExpiration']>
): ReturnType<LegacyApiSignatures['getNativeV1ProfileTokenExpiration']> => {
  const [options] = args
  return sdk.getNativeV1ProfileTokenExpiration({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1ProfileTokenExpiration']>
}

export const getNativeV1RecommendationOfferPagePlaylistsofferId = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1RecommendationOfferPagePlaylistsofferId']>
): ReturnType<LegacyApiSignatures['getNativeV1RecommendationOfferPagePlaylistsofferId']> => {
  const [offer_id, userId, longitude, latitude, options] = args
  return sdk.getNativeV1RecommendationOfferPagePlaylistsOfferId({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    path: { offer_id: offer_id },
    query: { userId: userId, longitude: longitude, latitude: latitude },
  }) as unknown as ReturnType<
    LegacyApiSignatures['getNativeV1RecommendationOfferPagePlaylistsofferId']
  >
}

export const postNativeV1RecommendationPlaylist = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1RecommendationPlaylist']>
): ReturnType<LegacyApiSignatures['postNativeV1RecommendationPlaylist']> => {
  const [body, modelEndpoint, longitude, latitude, options] = args
  return sdk.postNativeV1RecommendationPlaylist({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
    query: { modelEndpoint: modelEndpoint, longitude: longitude, latitude: latitude },
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1RecommendationPlaylist']>
}

export const getNativeV1RecommendationSimilarOffersofferId = (
  parameter0: NonNullable<
    ApiTypes.getNativeV1RecommendationSimilarOffersOfferIdData['path']
  >['offer_id'],
  parameter1?: NonNullable<
    ApiTypes.getNativeV1RecommendationSimilarOffersOfferIdData['query']
  >['longitude'],
  parameter2?: NonNullable<
    ApiTypes.getNativeV1RecommendationSimilarOffersOfferIdData['query']
  >['latitude'],
  parameter3?: NonNullable<
    ApiTypes.getNativeV1RecommendationSimilarOffersOfferIdData['query']
  >['categories'],
  parameter4?: NonNullable<
    ApiTypes.getNativeV1RecommendationSimilarOffersOfferIdData['query']
  >['subcategories'],
  parameter5?: NonNullable<
    ApiTypes.getNativeV1RecommendationSimilarOffersOfferIdData['query']
  >['searchGroupNames'],
  parameter6?: NonNullable<
    ApiTypes.getNativeV1RecommendationSimilarOffersOfferIdData['query']
  >['retrievalModel'],
  options: Omit<
    Options<ApiTypes.getNativeV1RecommendationSimilarOffersOfferIdData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.getNativeV1RecommendationSimilarOffersOfferIdResponse> => {
  return sdk.getNativeV1RecommendationSimilarOffersOfferId({
    ...options,
    credentials: options.credentials ?? 'omit',
    path: { offer_id: parameter0 },
    query: {
      longitude: parameter1,
      latitude: parameter2,
      categories: parameter3,
      subcategories: parameter4,
      searchGroupNames: parameter5,
      retrievalModel: parameter6,
    },
  })
}

export const getNativeV1RecommendationTopArtistsPlaylistsearchGroupName = (
  ...args: Parameters<
    LegacyApiSignatures['getNativeV1RecommendationTopArtistsPlaylistsearchGroupName']
  >
): ReturnType<
  LegacyApiSignatures['getNativeV1RecommendationTopArtistsPlaylistsearchGroupName']
> => {
  const [search_group_name, options] = args
  return sdk.getNativeV1RecommendationTopArtistsPlaylistSearchGroupName({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    path: { search_group_name: search_group_name },
  }) as unknown as ReturnType<
    LegacyApiSignatures['getNativeV1RecommendationTopArtistsPlaylistsearchGroupName']
  >
}

export const postNativeV1RequestPasswordReset = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1RequestPasswordReset']>
): ReturnType<LegacyApiSignatures['postNativeV1RequestPasswordReset']> => {
  const [body, options] = args
  return sdk.postNativeV1RequestPasswordReset({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1RequestPasswordReset']>
}

export const postNativeV1ResendEmailValidation = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1ResendEmailValidation']>
): ReturnType<LegacyApiSignatures['postNativeV1ResendEmailValidation']> => {
  const [body, options] = args
  return sdk.postNativeV1ResendEmailValidation({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1ResendEmailValidation']>
}

export const postNativeV1ResetPassword = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1ResetPassword']>
): ReturnType<LegacyApiSignatures['postNativeV1ResetPassword']> => {
  const [body, options] = args
  return sdk.postNativeV1ResetPassword({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1ResetPassword']>
}

export const postNativeV1ResetRecreditAmountToShow = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1ResetRecreditAmountToShow']>
): ReturnType<LegacyApiSignatures['postNativeV1ResetRecreditAmountToShow']> => {
  const [options] = args
  return sdk.postNativeV1ResetRecreditAmountToShow({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1ResetRecreditAmountToShow']>
}

export const postNativeV1SendOfferLinkByPushofferId = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1SendOfferLinkByPushofferId']>
): ReturnType<LegacyApiSignatures['postNativeV1SendOfferLinkByPushofferId']> => {
  const [offer_id, options] = args
  return sdk.postNativeV1SendOfferLinkByPushOfferId({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    path: { offer_id: offer_id },
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1SendOfferLinkByPushofferId']>
}

export const postNativeV1SendOfferWebappLinkByEmailofferId = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1SendOfferWebappLinkByEmailofferId']>
): ReturnType<LegacyApiSignatures['postNativeV1SendOfferWebappLinkByEmailofferId']> => {
  const [offer_id, options] = args
  return sdk.postNativeV1SendOfferWebappLinkByEmailOfferId({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    path: { offer_id: offer_id },
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1SendOfferWebappLinkByEmailofferId']>
}

export const getNativeV1Settings = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1Settings']>
): ReturnType<LegacyApiSignatures['getNativeV1Settings']> => {
  const [options] = args
  return sdk.getNativeV1Settings({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1Settings']>
}

export const postNativeV1Signin = (
  body: ApiTypes.postNativeV1SigninData['body'],
  options: Omit<Options<ApiTypes.postNativeV1SigninData, true>, 'body' | 'path' | 'query'> = {}
): Promise<ApiTypes.postNativeV1SigninResponse> => {
  return sdk.postNativeV1Signin({ ...options, credentials: options.credentials ?? 'omit', body })
}

export const postNativeV1Signout = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1Signout']>
): ReturnType<LegacyApiSignatures['postNativeV1Signout']> => {
  const [options] = args
  return sdk.postNativeV1Signout({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1Signout']>
}

export const getNativeV1SubcategoriesV2 = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1SubcategoriesV2']>
): ReturnType<LegacyApiSignatures['getNativeV1SubcategoriesV2']> => {
  const [options] = args
  return sdk.getNativeV1SubcategoriesV2({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1SubcategoriesV2']>
}

export const getNativeV1SubscriptionActivityTypes = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1SubscriptionActivityTypes']>
): ReturnType<LegacyApiSignatures['getNativeV1SubscriptionActivityTypes']> => {
  const [options] = args
  return sdk.getNativeV1SubscriptionActivityTypes({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1SubscriptionActivityTypes']>
}

export const postNativeV1SubscriptionBonusDisability = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1SubscriptionBonusDisability']>
): ReturnType<LegacyApiSignatures['postNativeV1SubscriptionBonusDisability']> => {
  const [body, options] = args
  return sdk.postNativeV1SubscriptionBonusDisability({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1SubscriptionBonusDisability']>
}

export const postNativeV1SubscriptionBonusQuotientFamilial = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1SubscriptionBonusQuotientFamilial']>
): ReturnType<LegacyApiSignatures['postNativeV1SubscriptionBonusQuotientFamilial']> => {
  const [body, options] = args
  return sdk.postNativeV1SubscriptionBonusQuotientFamilial({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1SubscriptionBonusQuotientFamilial']>
}

export const postNativeV1SubscriptionHonorStatement = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1SubscriptionHonorStatement']>
): ReturnType<LegacyApiSignatures['postNativeV1SubscriptionHonorStatement']> => {
  const [options] = args
  return sdk.postNativeV1SubscriptionHonorStatement({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1SubscriptionHonorStatement']>
}

export const postNativeV1SubscriptionProfile = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1SubscriptionProfile']>
): ReturnType<LegacyApiSignatures['postNativeV1SubscriptionProfile']> => {
  const [body, options] = args
  return sdk.postNativeV1SubscriptionProfile({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1SubscriptionProfile']>
}

export const postNativeV1UbbleIdentification = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1UbbleIdentification']>
): ReturnType<LegacyApiSignatures['postNativeV1UbbleIdentification']> => {
  const [body, options] = args
  return sdk.postNativeV1UbbleIdentification({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1UbbleIdentification']>
}

export const postNativeV1ValidateEmail = (
  ...args: Parameters<LegacyApiSignatures['postNativeV1ValidateEmail']>
): ReturnType<LegacyApiSignatures['postNativeV1ValidateEmail']> => {
  const [body, options] = args
  return sdk.postNativeV1ValidateEmail({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV1ValidateEmail']>
}

export const getNativeV1VenuevenueIdAdvices = (
  parameter0: NonNullable<ApiTypes.getNativeV1VenueVenueIdAdvicesData['path']>['venue_id'],
  parameter1?: NonNullable<
    ApiTypes.getNativeV1VenueVenueIdAdvicesData['query']
  >['maxContentLength'],
  parameter2?: NonNullable<ApiTypes.getNativeV1VenueVenueIdAdvicesData['query']>['page'],
  parameter3?: NonNullable<ApiTypes.getNativeV1VenueVenueIdAdvicesData['query']>['resultsPerPage'],
  options: Omit<
    Options<ApiTypes.getNativeV1VenueVenueIdAdvicesData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.getNativeV1VenueVenueIdAdvicesResponse> => {
  return sdk.getNativeV1VenueVenueIdAdvices({
    ...options,
    credentials: options.credentials ?? 'omit',
    path: { venue_id: parameter0 },
    query: { maxContentLength: parameter1, page: parameter2, resultsPerPage: parameter3 },
  })
}

export const getNativeV1VenuevenueIdMovieCalendar = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1VenuevenueIdMovieCalendar']>
): ReturnType<LegacyApiSignatures['getNativeV1VenuevenueIdMovieCalendar']> => {
  const [venue_id, from, to, options] = args
  return sdk.getNativeV1VenueVenueIdMovieCalendar({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    path: { venue_id: venue_id },
    query: { from: from, to: to },
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1VenuevenueIdMovieCalendar']>
}

export const getNativeV1VenuevenueIdMovieCalendarMe = (
  ...args: Parameters<LegacyApiSignatures['getNativeV1VenuevenueIdMovieCalendarMe']>
): ReturnType<LegacyApiSignatures['getNativeV1VenuevenueIdMovieCalendarMe']> => {
  const [venue_id, from, to, options] = args
  return sdk.getNativeV1VenueVenueIdMovieCalendarMe({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    path: { venue_id: venue_id },
    query: { from: from, to: to },
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV1VenuevenueIdMovieCalendarMe']>
}

export const getNativeV2Bookings = (
  ...args: Parameters<LegacyApiSignatures['getNativeV2Bookings']>
): ReturnType<LegacyApiSignatures['getNativeV2Bookings']> => {
  const [options] = args
  return sdk.getNativeV2Bookings({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV2Bookings']>
}

export const getNativeV2BookingsbookingId = (
  ...args: Parameters<LegacyApiSignatures['getNativeV2BookingsbookingId']>
): ReturnType<LegacyApiSignatures['getNativeV2BookingsbookingId']> => {
  const [booking_id, options] = args
  return sdk.getNativeV2BookingsBookingId({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    path: { booking_id: booking_id },
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV2BookingsbookingId']>
}

export const getNativeV2Bookingsstatus = (
  ...args: Parameters<LegacyApiSignatures['getNativeV2Bookingsstatus']>
): ReturnType<LegacyApiSignatures['getNativeV2Bookingsstatus']> => {
  const [status, options] = args
  return sdk.getNativeV2BookingsStatus({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    path: { status: status },
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV2Bookingsstatus']>
}

export const getNativeV2MeFavoritesArtists = (
  ...args: Parameters<LegacyApiSignatures['getNativeV2MeFavoritesArtists']>
): ReturnType<LegacyApiSignatures['getNativeV2MeFavoritesArtists']> => {
  const [options] = args
  return sdk.getNativeV2MeFavoritesArtists({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV2MeFavoritesArtists']>
}

export const postNativeV2MeFavoritesArtists = (
  ...args: Parameters<LegacyApiSignatures['postNativeV2MeFavoritesArtists']>
): ReturnType<LegacyApiSignatures['postNativeV2MeFavoritesArtists']> => {
  const [body, options] = args
  return sdk.postNativeV2MeFavoritesArtists({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV2MeFavoritesArtists']>
}

export const deleteNativeV2MeFavoritesArtistsfavoriteId = (
  ...args: Parameters<LegacyApiSignatures['deleteNativeV2MeFavoritesArtistsfavoriteId']>
): ReturnType<LegacyApiSignatures['deleteNativeV2MeFavoritesArtistsfavoriteId']> => {
  const [favorite_id, options] = args
  return sdk.deleteNativeV2MeFavoritesArtistsFavoriteId({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    path: { favorite_id: favorite_id },
  }) as unknown as ReturnType<LegacyApiSignatures['deleteNativeV2MeFavoritesArtistsfavoriteId']>
}

export const getNativeV2MeFavoritesOffers = (
  ...args: Parameters<LegacyApiSignatures['getNativeV2MeFavoritesOffers']>
): ReturnType<LegacyApiSignatures['getNativeV2MeFavoritesOffers']> => {
  const [options] = args
  return sdk.getNativeV2MeFavoritesOffers({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV2MeFavoritesOffers']>
}

export const postNativeV2MeFavoritesOffers = (
  ...args: Parameters<LegacyApiSignatures['postNativeV2MeFavoritesOffers']>
): ReturnType<LegacyApiSignatures['postNativeV2MeFavoritesOffers']> => {
  const [body, options] = args
  return sdk.postNativeV2MeFavoritesOffers({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV2MeFavoritesOffers']>
}

export const deleteNativeV2MeFavoritesOffersfavoriteId = (
  ...args: Parameters<LegacyApiSignatures['deleteNativeV2MeFavoritesOffersfavoriteId']>
): ReturnType<LegacyApiSignatures['deleteNativeV2MeFavoritesOffersfavoriteId']> => {
  const [favorite_id, options] = args
  return sdk.deleteNativeV2MeFavoritesOffersFavoriteId({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    path: { favorite_id: favorite_id },
  }) as unknown as ReturnType<LegacyApiSignatures['deleteNativeV2MeFavoritesOffersfavoriteId']>
}

export const getNativeV2MeFavoritesVenues = (
  options: Omit<
    Options<ApiTypes.getNativeV2MeFavoritesVenuesData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.getNativeV2MeFavoritesVenuesResponse> => {
  return sdk.getNativeV2MeFavoritesVenues({
    ...options,
    credentials: options.credentials ?? 'include',
  })
}

export const postNativeV2MeFavoritesVenues = (
  body: ApiTypes.postNativeV2MeFavoritesVenuesData['body'],
  options: Omit<
    Options<ApiTypes.postNativeV2MeFavoritesVenuesData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.postNativeV2MeFavoritesVenuesResponse> => {
  return sdk.postNativeV2MeFavoritesVenues({
    ...options,
    credentials: options.credentials ?? 'include',
    body,
  })
}

export const deleteNativeV2MeFavoritesVenuesfavoriteId = (
  parameter0: NonNullable<
    ApiTypes.deleteNativeV2MeFavoritesVenuesFavoriteIdData['path']
  >['favorite_id'],
  options: Omit<
    Options<ApiTypes.deleteNativeV2MeFavoritesVenuesFavoriteIdData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.deleteNativeV2MeFavoritesVenuesFavoriteIdResponse> => {
  return sdk.deleteNativeV2MeFavoritesVenuesFavoriteId({
    ...options,
    credentials: options.credentials ?? 'include',
    path: { favorite_id: parameter0 },
  })
}

export const getNativeV2MovieCalendar = (
  parameter2: NonNullable<ApiTypes.getNativeV2MovieCalendarData['query']>['latitude'],
  parameter3: NonNullable<ApiTypes.getNativeV2MovieCalendarData['query']>['longitude'],
  parameter0?: NonNullable<ApiTypes.getNativeV2MovieCalendarData['query']>['allocineId'],
  parameter1?: NonNullable<ApiTypes.getNativeV2MovieCalendarData['query']>['visa'],
  parameter4?: NonNullable<ApiTypes.getNativeV2MovieCalendarData['query']>['aroundRadius'],
  parameter5?: NonNullable<ApiTypes.getNativeV2MovieCalendarData['query']>['from'],
  parameter6?: NonNullable<ApiTypes.getNativeV2MovieCalendarData['query']>['to'],
  options: Omit<
    Options<ApiTypes.getNativeV2MovieCalendarData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.getNativeV2MovieCalendarResponse> => {
  return sdk.getNativeV2MovieCalendar({
    ...options,
    credentials: options.credentials ?? 'omit',
    query: {
      latitude: parameter2,
      longitude: parameter3,
      allocineId: parameter0,
      visa: parameter1,
      aroundRadius: parameter4,
      from: parameter5,
      to: parameter6,
    },
  })
}

export const getNativeV2MovieCalendarMe = (
  parameter2: NonNullable<ApiTypes.getNativeV2MovieCalendarMeData['query']>['latitude'],
  parameter3: NonNullable<ApiTypes.getNativeV2MovieCalendarMeData['query']>['longitude'],
  parameter0?: NonNullable<ApiTypes.getNativeV2MovieCalendarMeData['query']>['allocineId'],
  parameter1?: NonNullable<ApiTypes.getNativeV2MovieCalendarMeData['query']>['visa'],
  parameter4?: NonNullable<ApiTypes.getNativeV2MovieCalendarMeData['query']>['aroundRadius'],
  parameter5?: NonNullable<ApiTypes.getNativeV2MovieCalendarMeData['query']>['from'],
  parameter6?: NonNullable<ApiTypes.getNativeV2MovieCalendarMeData['query']>['to'],
  options: Omit<
    Options<ApiTypes.getNativeV2MovieCalendarMeData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.getNativeV2MovieCalendarMeResponse> => {
  return sdk.getNativeV2MovieCalendarMe({
    ...options,
    credentials: options.credentials ?? 'include',
    query: {
      latitude: parameter2,
      longitude: parameter3,
      allocineId: parameter0,
      visa: parameter1,
      aroundRadius: parameter4,
      from: parameter5,
      to: parameter6,
    },
  })
}

export const getNativeV2OauthState = (
  ...args: Parameters<LegacyApiSignatures['getNativeV2OauthState']>
): ReturnType<LegacyApiSignatures['getNativeV2OauthState']> => {
  const [options] = args
  return sdk.getNativeV2OauthState({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV2OauthState']>
}

export const postNativeV2OauthssoProviderAuthorize = (
  ...args: Parameters<LegacyApiSignatures['postNativeV2OauthssoProviderAuthorize']>
): ReturnType<LegacyApiSignatures['postNativeV2OauthssoProviderAuthorize']> => {
  const [body, sso_provider, options] = args
  return sdk.postNativeV2OauthSsoProviderAuthorize({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
    path: { sso_provider: sso_provider },
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV2OauthssoProviderAuthorize']>
}

export const postNativeV2OffersStocks = (
  ...args: Parameters<LegacyApiSignatures['postNativeV2OffersStocks']>
): ReturnType<LegacyApiSignatures['postNativeV2OffersStocks']> => {
  const [body, options] = args
  return sdk.postNativeV2OffersStocks({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV2OffersStocks']>
}

export const postNativeV2ProfileEmailUpdateConfirm = (
  ...args: Parameters<LegacyApiSignatures['postNativeV2ProfileEmailUpdateConfirm']>
): ReturnType<LegacyApiSignatures['postNativeV2ProfileEmailUpdateConfirm']> => {
  const [body, options] = args
  return sdk.postNativeV2ProfileEmailUpdateConfirm({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV2ProfileEmailUpdateConfirm']>
}

export const postNativeV2ProfileEmailUpdateNewEmail = (
  ...args: Parameters<LegacyApiSignatures['postNativeV2ProfileEmailUpdateNewEmail']>
): ReturnType<LegacyApiSignatures['postNativeV2ProfileEmailUpdateNewEmail']> => {
  const [body, options] = args
  return sdk.postNativeV2ProfileEmailUpdateNewEmail({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV2ProfileEmailUpdateNewEmail']>
}

export const postNativeV2ProfileEmailUpdateNewPassword = (
  ...args: Parameters<LegacyApiSignatures['postNativeV2ProfileEmailUpdateNewPassword']>
): ReturnType<LegacyApiSignatures['postNativeV2ProfileEmailUpdateNewPassword']> => {
  const [body, options] = args
  return sdk.postNativeV2ProfileEmailUpdateNewPassword({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV2ProfileEmailUpdateNewPassword']>
}

export const getNativeV2ProfileEmailUpdateStatus = (
  ...args: Parameters<LegacyApiSignatures['getNativeV2ProfileEmailUpdateStatus']>
): ReturnType<LegacyApiSignatures['getNativeV2ProfileEmailUpdateStatus']> => {
  const [options] = args
  return sdk.getNativeV2ProfileEmailUpdateStatus({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV2ProfileEmailUpdateStatus']>
}

export const postNativeV2ProfileUpdateEmail = (
  ...args: Parameters<LegacyApiSignatures['postNativeV2ProfileUpdateEmail']>
): ReturnType<LegacyApiSignatures['postNativeV2ProfileUpdateEmail']> => {
  const [options] = args
  return sdk.postNativeV2ProfileUpdateEmail({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV2ProfileUpdateEmail']>
}

export const postNativeV2Reaction = (
  ...args: Parameters<LegacyApiSignatures['postNativeV2Reaction']>
): ReturnType<LegacyApiSignatures['postNativeV2Reaction']> => {
  const [body, options] = args
  return sdk.postNativeV2Reaction({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV2Reaction']>
}

export const getNativeV2ReactionAvailable = (
  ...args: Parameters<LegacyApiSignatures['getNativeV2ReactionAvailable']>
): ReturnType<LegacyApiSignatures['getNativeV2ReactionAvailable']> => {
  const [options] = args
  return sdk.getNativeV2ReactionAvailable({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV2ReactionAvailable']>
}

export const postNativeV2RefreshAccessToken = (
  ...args: Parameters<LegacyApiSignatures['postNativeV2RefreshAccessToken']>
): ReturnType<LegacyApiSignatures['postNativeV2RefreshAccessToken']> => {
  const [body, options] = args
  return sdk.postNativeV2RefreshAccessToken({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV2RefreshAccessToken']>
}

export const postNativeV2Signin = (
  ...args: Parameters<LegacyApiSignatures['postNativeV2Signin']>
): ReturnType<LegacyApiSignatures['postNativeV2Signin']> => {
  const [body, options] = args
  return sdk.postNativeV2Signin({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV2Signin']>
}

export const getNativeV2SubscriptionStepper = (
  ...args: Parameters<LegacyApiSignatures['getNativeV2SubscriptionStepper']>
): ReturnType<LegacyApiSignatures['getNativeV2SubscriptionStepper']> => {
  const [options] = args
  return sdk.getNativeV2SubscriptionStepper({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV2SubscriptionStepper']>
}

export const getNativeV2VenuevenueId = (
  ...args: Parameters<LegacyApiSignatures['getNativeV2VenuevenueId']>
): ReturnType<LegacyApiSignatures['getNativeV2VenuevenueId']> => {
  const [venue_id, options] = args
  return sdk.getNativeV2VenueVenueId({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    path: { venue_id: venue_id },
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV2VenuevenueId']>
}

export const getNativeV2VenuevenueIdMovieCalendar = (
  parameter0: NonNullable<ApiTypes.getNativeV2VenueVenueIdMovieCalendarData['path']>['venue_id'],
  parameter1?: NonNullable<ApiTypes.getNativeV2VenueVenueIdMovieCalendarData['query']>['from'],
  parameter2?: NonNullable<ApiTypes.getNativeV2VenueVenueIdMovieCalendarData['query']>['to'],
  options: Omit<
    Options<ApiTypes.getNativeV2VenueVenueIdMovieCalendarData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.getNativeV2VenueVenueIdMovieCalendarResponse> => {
  return sdk.getNativeV2VenueVenueIdMovieCalendar({
    ...options,
    credentials: options.credentials ?? 'omit',
    path: { venue_id: parameter0 },
    query: { from: parameter1, to: parameter2 },
  })
}

export const getNativeV2VenuevenueIdMovieCalendarMe = (
  parameter0: NonNullable<ApiTypes.getNativeV2VenueVenueIdMovieCalendarMeData['path']>['venue_id'],
  parameter1?: NonNullable<ApiTypes.getNativeV2VenueVenueIdMovieCalendarMeData['query']>['from'],
  parameter2?: NonNullable<ApiTypes.getNativeV2VenueVenueIdMovieCalendarMeData['query']>['to'],
  options: Omit<
    Options<ApiTypes.getNativeV2VenueVenueIdMovieCalendarMeData, true>,
    'body' | 'path' | 'query'
  > = {}
): Promise<ApiTypes.getNativeV2VenueVenueIdMovieCalendarMeResponse> => {
  return sdk.getNativeV2VenueVenueIdMovieCalendarMe({
    ...options,
    credentials: options.credentials ?? 'include',
    path: { venue_id: parameter0 },
    query: { from: parameter1, to: parameter2 },
  })
}

export const getNativeV3BookingsbookingId = (
  ...args: Parameters<LegacyApiSignatures['getNativeV3BookingsbookingId']>
): ReturnType<LegacyApiSignatures['getNativeV3BookingsbookingId']> => {
  const [booking_id, options] = args
  return sdk.getNativeV3BookingsBookingId({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
    path: { booking_id: booking_id },
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV3BookingsbookingId']>
}

export const getNativeV3OfferofferId = (
  ...args: Parameters<LegacyApiSignatures['getNativeV3OfferofferId']>
): ReturnType<LegacyApiSignatures['getNativeV3OfferofferId']> => {
  const [offer_id, options] = args
  return sdk.getNativeV3OfferOfferId({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    path: { offer_id: offer_id },
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV3OfferofferId']>
}

export const postNativeV3OffersStocks = (
  ...args: Parameters<LegacyApiSignatures['postNativeV3OffersStocks']>
): ReturnType<LegacyApiSignatures['postNativeV3OffersStocks']> => {
  const [body, options] = args
  return sdk.postNativeV3OffersStocks({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'omit',
    body: body,
  }) as unknown as ReturnType<LegacyApiSignatures['postNativeV3OffersStocks']>
}

export const getNativeV3SubscriptionStepper = (
  ...args: Parameters<LegacyApiSignatures['getNativeV3SubscriptionStepper']>
): ReturnType<LegacyApiSignatures['getNativeV3SubscriptionStepper']> => {
  const [options] = args
  return sdk.getNativeV3SubscriptionStepper({
    ...(options ?? {}),
    credentials: (options ?? {}).credentials ?? 'include',
  }) as unknown as ReturnType<LegacyApiSignatures['getNativeV3SubscriptionStepper']>
}

const nativeApiImplementation = {
  postNativeV1Account,
  postNativeV1AccountAnonymize,
  postNativeV1AccountSuspend,
  getNativeV1AccountSuspendTokenValidationtoken,
  postNativeV1AccountSuspendForHackSuspicion,
  postNativeV1AccountSuspendForSuspiciousLogin,
  getNativeV1AccountSuspensionDate,
  getNativeV1AccountSuspensionStatus,
  postNativeV1AccountUnsuspend,
  postNativeV1AchievementsMarkAsSeen,
  getNativeV1ArtistsartistId,
  getNativeV1ArtistsartistIdSimilar,
  getNativeV1Banner,
  getNativeV1Bookings,
  postNativeV1Bookings,
  postNativeV1BookingsbookingIdCancel,
  postNativeV1BookingsbookingIdToggleDisplay,
  postNativeV1ChangePassword,
  postNativeV1CookiesConsent,
  getNativeV1Countries,
  postNativeV1CulturalSurveyAnswers,
  getNativeV1CulturalSurveyQuestions,
  getNativeV1EmailValidationRemainingResendsemail,
  postNativeV1Feedback,
  getNativeV1Me,
  getNativeV1MeFavorites,
  postNativeV1MeFavorites,
  deleteNativeV1MeFavoritesfavoriteId,
  getNativeV1MeReminders,
  postNativeV1MeReminders,
  deleteNativeV1MeRemindersreminderId,
  getNativeV1MovieCalendar,
  getNativeV1MovieCalendarMe,
  getNativeV1OauthState,
  postNativeV1OauthssoProviderAccount,
  postNativeV1OauthssoProviderAuthorize,
  getNativeV1OfferofferIdAdvices,
  getNativeV1OfferofferIdChronicles,
  patchNativeV1Profile,
  postNativeV1ProfileEmailUpdateCancel,
  putNativeV1ProfileEmailUpdateValidate,
  getNativeV1ProfileTokenExpiration,
  getNativeV1RecommendationOfferPagePlaylistsofferId,
  postNativeV1RecommendationPlaylist,
  getNativeV1RecommendationSimilarOffersofferId,
  getNativeV1RecommendationTopArtistsPlaylistsearchGroupName,
  postNativeV1RequestPasswordReset,
  postNativeV1ResendEmailValidation,
  postNativeV1ResetPassword,
  postNativeV1ResetRecreditAmountToShow,
  postNativeV1SendOfferLinkByPushofferId,
  postNativeV1SendOfferWebappLinkByEmailofferId,
  getNativeV1Settings,
  postNativeV1Signin,
  postNativeV1Signout,
  getNativeV1SubcategoriesV2,
  getNativeV1SubscriptionActivityTypes,
  postNativeV1SubscriptionBonusDisability,
  postNativeV1SubscriptionBonusQuotientFamilial,
  postNativeV1SubscriptionHonorStatement,
  postNativeV1SubscriptionProfile,
  postNativeV1UbbleIdentification,
  postNativeV1ValidateEmail,
  getNativeV1VenuevenueIdAdvices,
  getNativeV1VenuevenueIdMovieCalendar,
  getNativeV1VenuevenueIdMovieCalendarMe,
  getNativeV2Bookings,
  getNativeV2BookingsbookingId,
  getNativeV2Bookingsstatus,
  getNativeV2MeFavoritesArtists,
  postNativeV2MeFavoritesArtists,
  deleteNativeV2MeFavoritesArtistsfavoriteId,
  getNativeV2MeFavoritesOffers,
  postNativeV2MeFavoritesOffers,
  deleteNativeV2MeFavoritesOffersfavoriteId,
  getNativeV2MeFavoritesVenues,
  postNativeV2MeFavoritesVenues,
  deleteNativeV2MeFavoritesVenuesfavoriteId,
  getNativeV2MovieCalendar,
  getNativeV2MovieCalendarMe,
  getNativeV2OauthState,
  postNativeV2OauthssoProviderAuthorize,
  postNativeV2OffersStocks,
  postNativeV2ProfileEmailUpdateConfirm,
  postNativeV2ProfileEmailUpdateNewEmail,
  postNativeV2ProfileEmailUpdateNewPassword,
  getNativeV2ProfileEmailUpdateStatus,
  postNativeV2ProfileUpdateEmail,
  postNativeV2Reaction,
  getNativeV2ReactionAvailable,
  postNativeV2RefreshAccessToken,
  postNativeV2Signin,
  getNativeV2SubscriptionStepper,
  getNativeV2VenuevenueId,
  getNativeV2VenuevenueIdMovieCalendar,
  getNativeV2VenuevenueIdMovieCalendarMe,
  getNativeV3BookingsbookingId,
  getNativeV3OfferofferId,
  postNativeV3OffersStocks,
  getNativeV3SubscriptionStepper,
}

export const nativeApi = nativeApiImplementation as Omit<
  typeof nativeApiImplementation,
  keyof LegacyApiSignatures
> &
  LegacyApiSignatures

export type NativeApi = typeof nativeApi
