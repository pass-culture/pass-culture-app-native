import { OfferResponseV2 } from 'api/gen'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'

export type MovieOffer = {
  nextDate?: Date
  offer: OfferResponseV2
}

export const getNextMoviesByDate = (
  offersWithStocks: OfferResponseV2[],
  date: Date
): MovieOffer[] => {
  if (!offersWithStocks.length) {
    return []
  }

  return moviesOfferBuilder(offersWithStocks)
    .withoutMoviesAfterNbDays(15)
    .withoutMoviesOnDay(date)
    .withNextScreeningFromDate(date)
    .sortedByLast30DaysBooking()
    .build()
}
