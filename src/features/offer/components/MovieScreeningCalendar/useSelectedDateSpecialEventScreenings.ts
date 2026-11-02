import { useCallback, useState } from 'react'

import { StockResponse } from 'api/gen'
import { mapStockToCinemaScreeningCardProps } from 'features/offer/components/CinemaScreeningCard/mapStockToCinemaScreeningCardProps'
import { CinemaScreeningCardProps } from 'features/offer/components/CinemaScreeningCard/types'
import {
  MovieScreeningBookingData,
  MovieScreeningUserData,
} from 'features/offer/components/MovieScreeningCalendar/types'
import { convertToMinutes } from 'features/offer/helpers/convertToMinutes/convertToMinutes'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'

export const useSelectedDateSpecialEventScreening = (
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
          mapStockToCinemaScreeningCardProps({
            screening,
            offerVenueId,
            onSelectScreening: setBookingData,
            currency,
            euroToPacificFrancRate,
            onPressOfferCTA,
            movieScreeningUserData,
            isExternalBookingsDisabled,
          })
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
