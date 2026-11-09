import { StockResponse } from 'api/gen'
import { MovieScreeningUserData } from 'features/offer/components/MovieScreeningCalendar/types'

import { CinemaScreeningCardDisabledReason } from './types'

type Props = {
  screening: StockResponse
  movieScreeningUserData?: MovieScreeningUserData
  isExternalBookingsDisabled?: boolean
}

export const getCinemaScreeningCardDisabledReason = ({
  screening,
  movieScreeningUserData = {},
  isExternalBookingsDisabled = false,
}: Props): CinemaScreeningCardDisabledReason | undefined => {
  const {
    hasNotCompletedSubscriptionYet,
    isUserEligible = true,
    hasEnoughCredit,
    bookings: userBooking,
    isUserCreditExpired,
    isUserLoggedIn,
  } = movieScreeningUserData

  const hasBookedScreening = Boolean(
    screening.beginningDatetime &&
    userBooking?.stock.beginningDatetime === screening.beginningDatetime
  )
  if (isExternalBookingsDisabled) {
    return CinemaScreeningCardDisabledReason.UNAVAILABLE
  }

  if (screening.isSoldOut && (!isUserLoggedIn || hasEnoughCredit)) {
    return CinemaScreeningCardDisabledReason.FULLY_BOOKED
  }

  if (hasBookedScreening) {
    return CinemaScreeningCardDisabledReason.ALREADY_BOOKED
  }

  if (!screening.isBookable || isUserCreditExpired || !isUserEligible) {
    return CinemaScreeningCardDisabledReason.UNAVAILABLE
  }

  if (isUserLoggedIn && !hasEnoughCredit && !hasNotCompletedSubscriptionYet) {
    return CinemaScreeningCardDisabledReason.INSUFFICIENT_CREDIT
  }

  return undefined
}
