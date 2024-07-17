import { OfferResponseV2 } from 'api/gen'
import { MovieOffer } from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'

export const filterOffersStocksByDate = (offers: OfferResponseV2[], date: Date): MovieOffer[] => {
  if (!offers.length) {
    return []
  }

  return moviesOfferBuilder(offers).withMoviesOnDay(date).sortedByLast30DaysBooking().build()
}
