import { isToday } from 'date-fns'
import { useMemo } from 'react'

import { OfferResponseV2 } from 'api/gen'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'
import { useUserLocation } from 'features/offer/helpers/useUserLocation/useUserLocation'

export const useGetVenuesByDay = (date: Date, offers: OfferResponseV2[]) => {
  const location = useUserLocation()

  const dayOffers = useMemo(
    () =>
      moviesOfferBuilder(offers)
        .sortedByDistance(location)
        .withScreeningsOnDay(date)
        .withoutScreeningsAfterNbDays(15)
        .build(),
    [date, location, offers]
  )

  const nextOffers = useMemo(() => {
    return moviesOfferBuilder(offers)
      .withoutScreeningsAfterNbDays(15)
      .withoutScreeningsOnDay(date)
      .withNextScreeningFromDate(date)
      .sortedByDistance(location)
      .build()
  }, [date, location, offers])

  const after15DaysOffers = useMemo(
    () =>
      moviesOfferBuilder(offers).sortedByDistance(location).withScreeningsAfterNbDays(15).build(),
    [location, offers]
  )

  const movieOffers = useMemo(
    () => [...dayOffers, ...nextOffers, ...after15DaysOffers],
    [dayOffers, nextOffers, after15DaysOffers]
  )

  const hasStocksOnlyAfter15Days = useMemo(
    () => !dayOffers.length && !nextOffers.length && after15DaysOffers.length > 0,
    [after15DaysOffers.length, dayOffers.length, nextOffers.length]
  )

  return {
    movieOffers,
    hasStocksOnlyAfter15Days,
  }
}

export const getDaysWithNoScreenings = (offers: OfferResponseV2[], dates: Date[]) => {
  return dates.filter((date) =>
    isToday(date) ? false : !moviesOfferBuilder(offers).withScreeningsOnDay(date).build().length
  )
}
