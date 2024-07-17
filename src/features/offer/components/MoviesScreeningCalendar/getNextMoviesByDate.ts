import { OfferResponseV2 } from 'api/gen'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'

export type MoviesOffer = {
  nextDate?: Date
  isUpcoming: boolean
  offer: OfferResponseV2
}

export const getNextMoviesByDate = (
  offersWithStocks: OfferResponseV2[],
  date: Date
): MoviesOffer[] => {
  const filteredOffers = moviesOfferBuilder(offersWithStocks)
    .withoutMoviesAfter15Days()
    .withoutMoviesOnDay(date)
    .withNextScreeningFromDate(date)
    .build()

  return filteredOffers
}
