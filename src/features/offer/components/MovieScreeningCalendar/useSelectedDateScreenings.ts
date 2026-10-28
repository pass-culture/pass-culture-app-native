import { Dispatch, SetStateAction, useCallback, useState } from 'react'

import { StockResponse } from 'api/gen'
import { formatHour } from 'features/bookOffer/helpers/utils'
import { getCinemaScreeningFeaturesProps } from 'features/offer/components/CinemaScreeningCard/getCinemaScreeningCardProps'
import {
  CinemaScreeningCardDisabledReason,
  CinemaScreeningCardProps,
} from 'features/offer/components/CinemaScreeningCard/types'
import {
  MovieScreeningBookingData,
  MovieScreeningUserData,
} from 'features/offer/components/MovieScreeningCalendar/types'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { Currency, useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'

export const mapStockToCinemaScreeningCardProps = (
  screening: StockResponse,
  offerVenueId: number,
  setBookingData: Dispatch<SetStateAction<MovieScreeningBookingData | undefined>>,
  currency: Currency,
  euroToPacificFrancRate: number,
  onPressOfferCTA?: () => void,
  movieScreeningUserData?: MovieScreeningUserData,
  isExternalBookingsDisabled = false
): CinemaScreeningCardProps | undefined => {
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

  let disabledReason: CinemaScreeningCardDisabledReason | undefined

  switch (true) {
    case isExternalBookingsDisabled:
      disabledReason = CinemaScreeningCardDisabledReason.UNAVAILABLE
      break
    case isScreeningSoldOut && (!isUserLoggedIn || hasEnoughCredit):
      disabledReason = CinemaScreeningCardDisabledReason.FULLY_BOOKED
      break
    case hasBookedScreening:
      disabledReason = CinemaScreeningCardDisabledReason.ALREADY_BOOKED
      break
    case isUserCreditExpired || (isSameVenue && hasBookedOffer) || !isUserEligible:
      disabledReason = CinemaScreeningCardDisabledReason.UNAVAILABLE
      break
    case isUserLoggedIn && !hasEnoughCredit && !hasNotCompletedSubscriptionYet:
      disabledReason = CinemaScreeningCardDisabledReason.INSUFFICIENT_CREDIT
  }

  const onPress = () => {
    if (disabledReason) return

    setBookingData({
      date: new Date(beginningDatetime),
      hour: new Date(beginningDatetime).getHours(),
      stockId: screening.id,
    })

    onPressOfferCTA?.()
  }
  return {
    onPress,
    time: formatHour(beginningDatetime).replace(':', 'h'),
    price,
    disabledReason,
    ...(screening.screeningFeatures
      ? getCinemaScreeningFeaturesProps(screening.screeningFeatures)
      : { languages: [] }),
  }
}

export const convertToMinutes = (time: string): number => {
  const [hours, minutes] = time.split('h').map(Number)
  if (hours === undefined || minutes === undefined) return 0
  return hours * 60 + minutes
}

export const useSelectedDateScreening = (
  selectedScreeningStock: StockResponse[] | undefined,
  isExternalBookingsDisabled = false
) => {
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
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
          mapStockToCinemaScreeningCardProps(
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
            selectedDateScreening: CinemaScreeningCardProps | undefined
          ): selectedDateScreening is CinemaScreeningCardProps =>
            selectedDateScreening !== undefined
        )
        .sort((a, b) => {
          return convertToMinutes(a.time) - convertToMinutes(b.time)
        })
    },
    [selectedScreeningStock, currency, euroToPacificFrancRate, isExternalBookingsDisabled]
  )

  return {
    selectedDateScreenings,
    bookingData,
  }
}
