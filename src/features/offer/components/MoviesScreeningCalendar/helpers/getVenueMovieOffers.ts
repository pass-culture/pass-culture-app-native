import { OffersStocksResponseV2 } from 'api/gen'
import { getVenueMovieOffersByDate } from 'features/offer/components/MoviesScreeningCalendar/helpers/getVenueMovieOffersByDate'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'

export const getVenueMovieOffers = (
  selectedDate: Date,
  offersWithStocks?: OffersStocksResponseV2
) => getVenueMovieOffersByDate(selectedDate, moviesOfferBuilder, offersWithStocks?.offers)
