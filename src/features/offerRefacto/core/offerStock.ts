import { OfferResponseV2 } from 'api/gen'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'
import { GeoCoordinates } from 'libs/location/types'

export function extractStockDates(offer: OfferResponseV2): string[] {
  return offer.stocks
    .map((stock) => stock.beginningDatetime)
    .filter((date): date is string => date !== null && date !== undefined)
}

export const computeMovieOffers = (
  date: Date,
  offers: OfferResponseV2[],
  location: GeoCoordinates
) => {
  const dayOffers = moviesOfferBuilder(offers)
    .sortedByDistance(location)
    .withScreeningsOnDay(date)
    .build()

  const nextOffers = moviesOfferBuilder(offers)
    .withoutScreeningsAfterNbDays(15)
    .withoutScreeningsOnDay(date)
    .withNextScreeningFromDate(date)
    .sortedByDistance(location)
    .build()

  const after15DaysOffers = moviesOfferBuilder(offers)
    .sortedByDistance(location)
    .withScreeningsAfterNbDays(15)
    .build()

  const movieOffers = [...dayOffers, ...nextOffers, ...after15DaysOffers]

  const hasStocksOnlyAfter15Days =
    !dayOffers.length && !nextOffers.length && after15DaysOffers.length > 0

  return {
    movieOffers,
    hasStocksOnlyAfter15Days,
  }
}
