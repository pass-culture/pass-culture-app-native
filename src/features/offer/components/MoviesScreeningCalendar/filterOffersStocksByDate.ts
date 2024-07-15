import { OfferResponseV2 } from 'api/gen'
import { MoviesOffer } from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'

export const filterOffersStocks = (offers: OfferResponseV2[] = [], date: Date): MoviesOffer[] => {
  return moviesOfferBuilder(offers).withMoviesOnDay(date).sortedByLast30DaysBooking().build()
}
