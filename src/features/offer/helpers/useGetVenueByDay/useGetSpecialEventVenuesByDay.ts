import { isToday } from 'date-fns'

import { OfferForStocksResponse } from 'api/gen'
import { specialEventMoviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/specialEventMoviesOffer.builder'
import { useUserLocation } from 'features/offer/helpers/useUserLocation/useUserLocation'

export const useGetSpecialEventVenuesByDay = (date: Date, offers: OfferForStocksResponse[]) => {
  const location = useUserLocation()

  const dayOffers = specialEventMoviesOfferBuilder(offers)
    .sortedByDistance(location)
    .withScreeningsOnDay(date)
    .build()

  const nextOffers = specialEventMoviesOfferBuilder(offers)
    .withoutScreeningsAfterNbDays(15)
    .withoutScreeningsOnDay(date)
    .withNextScreeningFromDate(date)
    .sortedByDistance(location)
    .build()

  const after15DaysOffers = specialEventMoviesOfferBuilder(offers)
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

export const getDaysWithNoScreenings = (offers: OfferForStocksResponse[], dates: Date[]) => {
  return dates.filter((date) =>
    isToday(date)
      ? false
      : !specialEventMoviesOfferBuilder(offers).withScreeningsOnDay(date).build().length
  )
}
