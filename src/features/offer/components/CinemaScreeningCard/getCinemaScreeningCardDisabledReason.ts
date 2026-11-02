import { StockResponse } from 'api/gen'
import { MovieScreeningUserData } from 'features/offer/components/MovieScreeningCalendar/types'

import { CinemaScreeningCardDisabledReason } from './types'

type Params = {
  screening: StockResponse
  offerVenueId: number
  movieScreeningUserData?: MovieScreeningUserData
  isExternalBookingsDisabled?: boolean
}

export const getCinemaScreeningCardDisabledReason = ({
  screening,
  offerVenueId,
  movieScreeningUserData = {},
  isExternalBookingsDisabled = false,
}: Params): CinemaScreeningCardDisabledReason | undefined => {
  const {
    hasNotCompletedSubscriptionYet,
    isUserEligible = true,
    hasEnoughCredit,
    bookings: userBooking,
    isUserCreditExpired,
    hasBookedOffer,
    isUserLoggedIn,
  } = movieScreeningUserData

  const hasBookedScreening = Boolean(
    screening.beginningDatetime &&
    userBooking?.stock.beginningDatetime === screening.beginningDatetime
  )
  const hasBookedRelatedOffer = offerVenueId === userBooking?.stock.offer.venue.id && hasBookedOffer

  if (isExternalBookingsDisabled) {
    return CinemaScreeningCardDisabledReason.UNAVAILABLE
  }

  if (screening.isSoldOut && (!isUserLoggedIn || hasEnoughCredit)) {
    return CinemaScreeningCardDisabledReason.FULLY_BOOKED
  }

  if (hasBookedScreening) {
    return CinemaScreeningCardDisabledReason.ALREADY_BOOKED
  }

  if (!screening.isBookable || isUserCreditExpired || hasBookedRelatedOffer || !isUserEligible) {
    return CinemaScreeningCardDisabledReason.UNAVAILABLE
  }

  if (isUserLoggedIn && !hasEnoughCredit && !hasNotCompletedSubscriptionYet) {
    return CinemaScreeningCardDisabledReason.INSUFFICIENT_CREDIT
  }

  return undefined
}
