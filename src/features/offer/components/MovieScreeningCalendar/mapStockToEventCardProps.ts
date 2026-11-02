import { OfferStockResponse } from 'api/gen'
import { formatHour } from 'features/bookOffer/helpers/utils'
import { EventCardSubtitleEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import { getEventCardStatus } from 'features/offer/components/MovieScreeningCalendar/getEventCardStatus'
import {
  MovieScreeningBookingData,
  MovieScreeningUserData,
} from 'features/offer/components/MovieScreeningCalendar/types'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { EventCardProps } from 'ui/components/eventCard/EventCard'

type MapStockToEventCardPropsParams = {
  screening: OfferStockResponse
  offerVenueId: number
  onSelectScreening: (bookingData: MovieScreeningBookingData) => void
  currency: Currency
  euroToPacificFrancRate: number
  onPressOfferCTA?: VoidFunction
  movieScreeningUserData?: MovieScreeningUserData
  isExternalBookingsDisabled?: boolean
}

export const mapStockToEventCardProps = ({
  screening,
  offerVenueId,
  onSelectScreening,
  currency,
  euroToPacificFrancRate,
  onPressOfferCTA,
  movieScreeningUserData,
  isExternalBookingsDisabled = false,
}: MapStockToEventCardPropsParams): EventCardProps | undefined => {
  const { beginningDatetime, isSoldOut: isScreeningSoldOut } = screening

  if (!beginningDatetime) return undefined

  const {
    hasNotCompletedSubscriptionYet,
    isUserEligible = true,
    hasEnoughCredit,
    bookings: userBookings,
    isUserCreditExpired,
    hasBookedOffer,
    isUserLoggedIn,
  } = movieScreeningUserData ?? {}

  const price = formatCurrencyFromCents(screening.price, currency, euroToPacificFrancRate)
  const hasBookedScreening = userBookings?.stock?.beginningDatetime === beginningDatetime
  const isSameVenue = offerVenueId === userBookings?.stock?.offer?.venue?.id

  const { isDisabled, subtitleLeft } = getEventCardStatus({
    features: screening.features,
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
  })

  const shouldNotHaveSubtitleRight = [
    EventCardSubtitleEnum.UNAVAILABLE,
    EventCardSubtitleEnum.NOT_ENOUGH_CREDIT,
    EventCardSubtitleEnum.ALREADY_BOOKED,
    EventCardSubtitleEnum.FULLY_BOOKED,
  ].includes(subtitleLeft as EventCardSubtitleEnum)

  return {
    onPress: () => {
      if (hasBookedScreening || isDisabled) return

      onSelectScreening({
        date: new Date(beginningDatetime),
        hour: new Date(beginningDatetime).getHours(),
        stockId: screening.id,
      })
      onPressOfferCTA?.()
    },
    isDisabled,
    title: formatHour(beginningDatetime).replace(':', 'h'),
    subtitleLeft,
    subtitleRight: shouldNotHaveSubtitleRight ? undefined : price,
  }
}
