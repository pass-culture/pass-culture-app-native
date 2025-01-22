import { OffersStocksResponseV2, SubcategoryIdEnum } from 'api/gen'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'

export const getVenueMovieOffers = (
  selectedDate: Date,
  offersWithStocks: OffersStocksResponseV2 | undefined
) => {
  const movieOffers = offersWithStocks?.offers.filter(
    (offer) => offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  )

  const dayOffers = moviesOfferBuilder(movieOffers)
    .withScreeningsOnDay(selectedDate)
    .sortedByLast30DaysBooking()
    .build()

  const nextOffers = moviesOfferBuilder(movieOffers)
    .withoutScreeningsOnDay(selectedDate)
    .withoutScreeningsAfterNbDays(15)
    .withNextScreeningFromDate(selectedDate)
    .sortedByLast30DaysBooking()
    .build()

  const after15DaysOffers = moviesOfferBuilder(movieOffers)
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
