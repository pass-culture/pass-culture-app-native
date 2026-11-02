import { OffersStocksResponse } from 'api/gen'
import { getVenueMovieOffersByDate } from 'features/offer/components/MoviesScreeningCalendar/helpers/getVenueMovieOffersByDate'
import { specialEventMoviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/specialEventMoviesOffer.builder'

export const getSpecialEventVenueMovieOffers = (
  selectedDate: Date,
  offersWithStocks: OffersStocksResponse | undefined
) =>
  getVenueMovieOffersByDate(selectedDate, offersWithStocks?.offers, specialEventMoviesOfferBuilder)
