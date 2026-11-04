import { SubcategoryIdEnum } from 'api/gen'
import { CreateMovieOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/helpers/movieOfferBuilderTypes'

type CinemaOffer = {
  subcategoryId: string
}

export const getVenueMovieOffersByDate = <Offer extends CinemaOffer, MovieOffer>(
  selectedDate: Date,
  createMovieOfferBuilder: CreateMovieOfferBuilder<Offer, MovieOffer>,
  offers?: Offer[]
) => {
  const cinemaOffers = offers?.filter(
    ({ subcategoryId }) => subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  )

  const dayOffers = createMovieOfferBuilder(cinemaOffers)
    .withScreeningsOnDay(selectedDate)
    .sortedByLast30DaysBooking()
    .build()

  const nextOffers = createMovieOfferBuilder(cinemaOffers)
    .withoutScreeningsOnDay(selectedDate)
    .withoutScreeningsAfterNbDays(15)
    .withNextScreeningFromDate(selectedDate)
    .sortedByLast30DaysBooking()
    .build()

  const after15DaysOffers = createMovieOfferBuilder(cinemaOffers)
    .withScreeningsAfterNbDays(15)
    .sortedByLast30DaysBooking()
    .sortedByDate()
    .build()

  const hasStocksOnlyAfter15Days =
    !dayOffers.length && !nextOffers.length && after15DaysOffers.length > 0

  return {
    venueMovieOffers: hasStocksOnlyAfter15Days ? after15DaysOffers : [...dayOffers, ...nextOffers],
    hasStocksOnlyAfter15Days,
  }
}
