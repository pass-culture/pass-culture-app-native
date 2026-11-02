import { GeoCoordinates } from 'libs/location/location'

type MovieOfferBuilder<MovieOffer> = {
  withoutScreeningsOnDay: (selectedDate: Date) => MovieOfferBuilder<MovieOffer>
  withScreeningsOnDay: (selectedDate: Date) => MovieOfferBuilder<MovieOffer>
  sortedByLast30DaysBooking: () => MovieOfferBuilder<MovieOffer>
  sortedByDistance: (location: GeoCoordinates) => MovieOfferBuilder<MovieOffer>
  sortedByDate: () => MovieOfferBuilder<MovieOffer>
  withScreeningsAfterNbDays: (nbDays: number) => MovieOfferBuilder<MovieOffer>
  withoutScreeningsAfterNbDays: (nbDays: number) => MovieOfferBuilder<MovieOffer>
  withNextScreeningFromDate: (selectedDate: Date) => MovieOfferBuilder<MovieOffer>
  build: () => MovieOffer[]
}

export type CreateMovieOfferBuilder<Offer, MovieOffer> = (
  offers?: Offer[]
) => MovieOfferBuilder<MovieOffer>
