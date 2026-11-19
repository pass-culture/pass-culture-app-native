import { useCallback, useState } from 'react'

import { OfferStockResponse } from 'api/gen'
import { mapStockToEventCardProps } from 'features/offer/components/MovieScreeningCalendar/mapStockToEventCardProps'
import {
  MovieScreeningBookingData,
  MovieScreeningUserData,
} from 'features/offer/components/MovieScreeningCalendar/types'
import { convertToMinutes } from 'features/offer/helpers/convertToMinutes/convertToMinutes'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { EventCardProps } from 'ui/components/eventCard/EventCard'

export const useSelectedDateScreening = (
  selectedScreeningStock: OfferStockResponse[] | undefined,
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
          mapStockToEventCardProps({
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
