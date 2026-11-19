import { EventCardSubtitleEnum } from 'features/offer/components/MovieScreeningCalendar/enums'

type Props = {
  features: string[]
  isExternalBookingsDisabled: boolean
  isScreeningSoldOut: boolean
  isUserLoggedIn?: boolean
  hasEnoughCredit?: boolean
  hasBookedScreening: boolean
  isUserCreditExpired?: boolean
  isSameVenue: boolean
  hasBookedOffer?: boolean
  isUserEligible: boolean
  hasNotCompletedSubscriptionYet?: boolean
}

export const getEventCardStatus = ({
  features,
  isExternalBookingsDisabled,
  isScreeningSoldOut,
  isUserLoggedIn,
  hasEnoughCredit,
  hasBookedScreening,
  isUserCreditExpired,
  isSameVenue,
  hasBookedOffer,
  isUserEligible,
  hasNotCompletedSubscriptionYet,
}: Props) => {
  if (isExternalBookingsDisabled) {
    return { isDisabled: true, subtitleLeft: EventCardSubtitleEnum.UNAVAILABLE }
  }

  if (isScreeningSoldOut && (!isUserLoggedIn || hasEnoughCredit)) {
    return { isDisabled: true, subtitleLeft: EventCardSubtitleEnum.FULLY_BOOKED }
  }

  if (hasBookedScreening) {
    return { isDisabled: true, subtitleLeft: EventCardSubtitleEnum.ALREADY_BOOKED }
  }

  const screeningFeatures = features.join(', ')
  if (isUserCreditExpired || (isSameVenue && hasBookedOffer) || !isUserEligible) {
    return { isDisabled: true, subtitleLeft: screeningFeatures }
  }

  if (isUserLoggedIn && !hasEnoughCredit && !hasNotCompletedSubscriptionYet) {
    return { isDisabled: true, subtitleLeft: EventCardSubtitleEnum.NOT_ENOUGH_CREDIT }
  }

  return { isDisabled: false, subtitleLeft: screeningFeatures }
}
