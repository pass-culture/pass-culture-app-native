import { OfferResponseV2 } from 'api/gen'
import {
  withoutScreeningsAfterNbDays,
  withoutScreeningsOnDay,
  sortedByLast30DaysBooking,
  withoutNextScreeningFromDate,
  withNextScreeningFromDate,
} from 'features/offer/components/MoviesScreeningCalendar/withoutScreeningsAfterNbDays'

export type MovieOffer = {
  nextDate?: Date
  offer: OfferResponseV2
}

type Predicate = (toto: MovieOffer) => boolean

const mergeFilter = (filter1: Predicate, filter2: Predicate) => {
  return (toto: MovieOffer) => filter1(toto) && filter2(toto)
}

const predicatInverse = (filter: Predicate) => {
  const lePrédicatInversé: Predicate = (movieOffer) => !filter(movieOffer)
  return lePrédicatInversé
}

export const getNextMoviesByDate = (
  offersWithStocks: OfferResponseV2[],
  date: Date
): MovieOffer[] => {
  const pleinDeFiltresMétierIntelligents = mergeFilter(
    withoutScreeningsAfterNbDays(15),
    predicatInverse(predicatInverse(withoutScreeningsOnDay(date)))
  )
  const lePrédicat = withoutScreeningsOnDay(date)
  const functor = (offer) => ({
    offer,
    isUpcoming: false,
  })
  const functor2 = (offer) => ({
    ...offer,
    description: null,
  })
  const movieOffers: MovieOffer[] = offersWithStocks
    .map(functor)
    .filter(withNextScreeningFromDate(date))
    .filter(withoutNextScreeningFromDate(date))
    .filter(pleinDeFiltresMétierIntelligents)
    .toSorted(sortedByLast30DaysBooking)

  return movieOffers
}
