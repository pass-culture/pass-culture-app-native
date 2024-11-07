import { OfferResponseV2 } from 'api/gen'
import { MovieOffer } from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'

export const filterOffersStocksByDate = (offers: OfferResponseV2[], date: Date): MovieOffer[] => {
  return moviesOfferBuilder(offers).withScreeningsOnDay(date).sortedByLast30DaysBooking().build()
}
