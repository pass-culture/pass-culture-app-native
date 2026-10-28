import { Bookability, ScreeningFeatures, ScreeningV2 } from 'api/gen'
import { formatDateWithTimeZoneOffset } from 'libs/parsers/formatDates'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

import { CinemaScreeningCardDisabledReason, CinemaScreeningCardProps } from './types'

const SPECIAL_EVENT_LABELS: Partial<Record<string, string>> = {
  PREVIEW_SCREENING_WITH_CREW: 'Avant première',
}

const VIDEO_LABELS: Partial<Record<string, string>> = {
  IMAX: 'IMAX',
}

const AUDIO_LABELS: Partial<Record<string, string>> = {
  DOLBY_ATMOS: 'DolbyAtmos',
}

export const getCinemaScreeningCardDisabledReason = (
  bookability: Bookability
): CinemaScreeningCardDisabledReason | undefined => {
  switch (bookability) {
    case Bookability.STOCK_IS_SOLD_OUT:
      return CinemaScreeningCardDisabledReason.FULLY_BOOKED
    case Bookability.USER_HAS_ALREADY_BOOKED_OFFER:
    case Bookability.USER_HAS_ALREADY_BOOKED_RELATED_OFFER:
      return CinemaScreeningCardDisabledReason.ALREADY_BOOKED
    case Bookability.USER_HAS_INSUFFICIENT_CREDIT:
      return CinemaScreeningCardDisabledReason.INSUFFICIENT_CREDIT
    case Bookability.STOCK_BOOKING_IS_DISABLED:
    case Bookability.USER_CANNOT_BOOK:
      return CinemaScreeningCardDisabledReason.UNAVAILABLE
    case Bookability.BOOKABLE:
    case Bookability.AUTHENTICATION_REQUIRED:
    case Bookability.FINISH_SUBSCRIPTION_REQUIRED:
    case Bookability.USER_APPLICATION_STILL_PROCESSING:
    case Bookability.USER_HAS_APPLICATION_ERROR:
      return undefined
  }
}

const getFeatureLabel = (value: string | null, labels: Partial<Record<string, string>>) =>
  value ? labels[value] : undefined

export const getCinemaScreeningFeaturesProps = (features: ScreeningFeatures) => {
  const video = getFeatureLabel(features.video, VIDEO_LABELS)
  const audio = getFeatureLabel(features.audio, AUDIO_LABELS)

  return {
    languages: features.language ? [features.language] : [],
    specialEvent: getFeatureLabel(features.specialEventType, SPECIAL_EVENT_LABELS),
    video: video ? [video] : [],
    audio: audio ? [audio] : [],
    accessibility: features.accessibility,
  }
}

export const getCinemaScreeningCardProps = (
  screening: ScreeningV2,
  onPress: VoidFunction,
  currency: Currency,
  euroToPacificFrancRate: number
): CinemaScreeningCardProps => ({
  time: formatDateWithTimeZoneOffset(screening.beginningDatetime, "HH'h'mm"),
  price: formatCurrencyFromCents(screening.price * 100, currency, euroToPacificFrancRate),
  onPress,
  disabledReason: getCinemaScreeningCardDisabledReason(screening.bookability),
  ...getCinemaScreeningFeaturesProps(screening.features),
})
