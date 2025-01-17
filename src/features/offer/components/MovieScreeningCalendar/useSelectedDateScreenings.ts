import { Dispatch, SetStateAction, useCallback, useState } from 'react'

import { OfferStockResponse } from 'api/gen'
import { formatHour } from 'features/bookOffer/helpers/utils'
import { EventCardSubtitleEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import {
  MovieScreeningBookingData,
  MovieScreeningUserData,
} from 'features/offer/components/MovieScreeningCalendar/types'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { Currency, useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { EventCardProps } from 'ui/components/eventCard/EventCard'

const mapScreeningsToEventCardProps = (
  screening: OfferStockResponse,
  offerVenueId: number,
  setBookingData: Dispatch<SetStateAction<MovieScreeningBookingData | undefined>>,
  currency: Currency,
  euroToPacificFrancRate: number,
  onPressOfferCTA?: () => void,
  movieScreeningUserData?: MovieScreeningUserData,
  isExternalBookingsDisabled = false
): EventCardProps | undefined => {
  const { beginningDatetime, isSoldOut: isScreeningSoldOut } = screening

  if (!beginningDatetime) {
    return undefined
  }

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

  let isDisabled: boolean
  let subtitleLeft: EventCardSubtitleEnum | string

  switch (true) {
    case isExternalBookingsDisabled:
      subtitleLeft = EventCardSubtitleEnum.UNAVAILABLE
      isDisabled = true
      break
    case isScreeningSoldOut && (!isUserLoggedIn || hasEnoughCredit):
      subtitleLeft = EventCardSubtitleEnum.FULLY_BOOKED
      isDisabled = true
      break
    case hasBookedScreening:
      subtitleLeft = EventCardSubtitleEnum.ALREADY_BOOKED
      isDisabled = true
      break
    case isUserCreditExpired || (isSameVenue && hasBookedOffer) || !isUserEligible:
      subtitleLeft = screening.features.join(', ')
      isDisabled = true
      break
    case isUserLoggedIn && !hasEnoughCredit && !hasNotCompletedSubscriptionYet:
      subtitleLeft = EventCardSubtitleEnum.NOT_ENOUGH_CREDIT
      isDisabled = true
      break
    default:
      subtitleLeft = screening.features.join(', ')
      isDisabled = false
  }

  const shouldNotHaveSubtitleRight =
    subtitleLeft === EventCardSubtitleEnum.UNAVAILABLE ||
    subtitleLeft === EventCardSubtitleEnum.NOT_ENOUGH_CREDIT ||
    subtitleLeft === EventCardSubtitleEnum.ALREADY_BOOKED ||
    subtitleLeft === EventCardSubtitleEnum.FULLY_BOOKED
  const subtitleRight = shouldNotHaveSubtitleRight ? undefined : price

  const onPress = () => {
    if (hasBookedScreening || isDisabled) return

    setBookingData({
      date: new Date(beginningDatetime),
      hour: new Date(beginningDatetime).getHours(),
      stockId: screening.id,
    })

    onPressOfferCTA?.()
  }
  return {
    onPress,
    isDisabled,
    title: formatHour(beginningDatetime).replace(':', 'h'),
    subtitleLeft,
    subtitleRight,
  }
}

export const convertToMinutes = (time: string): number => {
  const [hours, minutes] = time.split('h').map(Number)
  if (hours === undefined || minutes === undefined) return 0
  return hours * 60 + minutes
}

export const useSelectedDateScreening = (
  selectedScreeningStock: OfferStockResponse[] | undefined,
  isExternalBookingsDisabled = false
) => {
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const [bookingData, setBookingData] = useState<MovieScreeningBookingData>()
  const selectedDateScreenings = useCallback(
    (
      offerVenueId: number,
      onPressOfferCTA?: () => void,
      movieScreeningUserData?: MovieScreeningUserData
    ) => {
      if (!selectedScreeningStock) {
        return []
      }

      return selectedScreeningStock
        .map((screening) =>
          mapScreeningsToEventCardProps(
            screening,
            offerVenueId,
            setBookingData,
            currency,
            euroToPacificFrancRate,
            onPressOfferCTA,
            movieScreeningUserData,
            isExternalBookingsDisabled
          )
        )
        .filter(
          (
            selectedDateScreening: EventCardProps | undefined
          ): selectedDateScreening is EventCardProps => selectedDateScreening !== undefined
        )
        .sort((a, b) => {
          return convertToMinutes(a.title) - convertToMinutes(b.title)
        })
    },
    [selectedScreeningStock, currency, euroToPacificFrancRate, isExternalBookingsDisabled]
  )

  return {
    selectedDateScreenings,
    bookingData,
  }
}
