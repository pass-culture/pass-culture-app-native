import { CreateMovieOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/helpers/movieOfferBuilderTypes'
import { GeoCoordinates } from 'libs/location/location'

export const getMovieOffersByDay = <Offer, MovieOffer>(
  date: Date,
  offers: Offer[],
  location: GeoCoordinates,
  createMovieOfferBuilder: CreateMovieOfferBuilder<Offer, MovieOffer>
) => {
  const dayOffers = createMovieOfferBuilder(offers)
    .sortedByDistance(location)
    .withScreeningsOnDay(date)
    .build()

  const nextOffers = createMovieOfferBuilder(offers)
    .withoutScreeningsAfterNbDays(15)
    .withoutScreeningsOnDay(date)
    .withNextScreeningFromDate(date)
    .sortedByDistance(location)
    .build()

  const after15DaysOffers = createMovieOfferBuilder(offers)
    .sortedByDistance(location)
    .withScreeningsAfterNbDays(15)
    .build()

  return {
    movieOffers: [...dayOffers, ...nextOffers, ...after15DaysOffers],
    hasStocksOnlyAfter15Days:
      !dayOffers.length && !nextOffers.length && after15DaysOffers.length > 0,
  }
}
