import { OffersStocksResponse, SubcategoryIdEnum } from 'api/gen'
import { specialEventMoviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/specialEventMoviesOffer.builder'

export const getSpecialEventVenueMovieOffers = (
  selectedDate: Date,
  offersWithStocks: OffersStocksResponse | undefined
) => {
  const movieOffers = offersWithStocks?.offers.filter(
    (offer) => offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  )

  const dayOffers = specialEventMoviesOfferBuilder(movieOffers)
    .withScreeningsOnDay(selectedDate)
    .sortedByLast30DaysBooking()
    .build()

  const nextOffers = specialEventMoviesOfferBuilder(movieOffers)
    .withoutScreeningsOnDay(selectedDate)
    .withoutScreeningsAfterNbDays(15)
    .withNextScreeningFromDate(selectedDate)
    .sortedByLast30DaysBooking()
    .build()

  const after15DaysOffers = specialEventMoviesOfferBuilder(movieOffers)
    .withScreeningsAfterNbDays(15)
    .sortedByLast30DaysBooking()
    .sortedByDate()
    .build()

  const hasStocksOnlyAfter15Days =
    !dayOffers.length && !nextOffers.length && after15DaysOffers.length > 0

  const venueMovieOffers = hasStocksOnlyAfter15Days
    ? after15DaysOffers
    : [...dayOffers, ...nextOffers]

  return {
    venueMovieOffers,
    hasStocksOnlyAfter15Days,
  }
}
