import { isToday } from 'date-fns'

import { OfferResponse } from 'api/gen'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'
import { useUserLocation } from 'features/offer/helpers/useUserLocation/useUserLocation'

export const useGetVenuesByDay = (date: Date, offers: OfferResponse[]) => {
  const location = useUserLocation()

  const dayOffers = moviesOfferBuilder(offers)
    .sortedByDistance(location)
    .withScreeningsOnDay(date)
    .build()

  const nextOffers = moviesOfferBuilder(offers)
    .withoutScreeningsAfterNbDays(15)
    .withoutScreeningsOnDay(date)
    .withNextScreeningFromDate(date)
    .sortedByDistance(location)
    .build()

  const after15DaysOffers = moviesOfferBuilder(offers)
    .sortedByDistance(location)
    .withScreeningsAfterNbDays(15)
    .build()

  const movieOffers = [...dayOffers, ...nextOffers, ...after15DaysOffers]

  const hasStocksOnlyAfter15Days =
    !dayOffers.length && !nextOffers.length && after15DaysOffers.length > 0

  return {
    movieOffers,
    hasStocksOnlyAfter15Days,
  }
}

export const getDaysWithNoScreenings = (offers: OfferResponse[], dates: Date[]) => {
  return dates.filter((date) =>
    isToday(date) ? false : !moviesOfferBuilder(offers).withScreeningsOnDay(date).build().length
  )
}
