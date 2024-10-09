import { Hit } from '@algolia/client-search'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { OfferResponseV2 } from 'api/gen'
import { useSearchVenueOffers } from 'api/useSearchVenuesOffer/useSearchVenueOffers'
import { useOffersStocks } from 'features/offer/api/useOffersStocks'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'
import { useLocation } from 'libs/location'
import { Offer } from 'shared/offer/types'

const DEFAULT_DISTANCE_KM = 10

type Options = Partial<{
  distanceKm: number
  initialCount: number
  nextCount: number
}>

export const useGetVenuesByDay = (date: Date, offer: OfferResponseV2, options?: Options) => {
  const { distanceKm = DEFAULT_DISTANCE_KM, initialCount = 6, nextCount = 3 } = options || {}
  const [count, setCount] = useState<number>(initialCount)
  const { userLocation } = useLocation()

  const { data } = useSearchVenueOffers({
    offerId: offer.id,
    venueId: offer.venue.id,
    geolocation: userLocation ?? {
      latitude: offer.venue.coordinates.latitude ?? 0,
      longitude: offer.venue.coordinates.longitude ?? 0,
    },
    hitsPerPage: 10_000,
    aroundMeRadius: distanceKm * 1000,
  })

  const offerIds = extractOfferIdsFromHits(data?.pages[0]?.hits)
  const { data: offersWithStocks, isLoading } = useOffersStocks({ offerIds })

  useEffect(() => {
    setCount(initialCount)
  }, [date, initialCount])

  const filteredOffers = useMemo(
    () =>
      moviesOfferBuilder(offersWithStocks?.offers)
        .withMoviesOnDay(date)
        .sortedByLast30DaysBooking()
        .buildOfferResponse(),
    [date, offersWithStocks?.offers]
  )

  const exposedOffers = useMemo(
    () => (count === filteredOffers.length ? filteredOffers : filteredOffers.slice(0, count)),
    [count, filteredOffers]
  )

  const getNext = useCallback(
    () =>
      setCount((count) => {
        const newCount = count + nextCount
        if (filteredOffers.length && newCount >= filteredOffers.length) {
          return filteredOffers.length
        }
        return newCount
      }),
    [filteredOffers.length, nextCount]
  )

  const isEnd = useMemo(() => {
    return exposedOffers.length === filteredOffers.length
  }, [exposedOffers.length, filteredOffers.length])

  return {
    items: exposedOffers,
    isLoading,
    getNext,
    isEnd,
  }
}

const extractOfferIdsFromHits = (hits: Hit<Offer>[] | undefined) => {
  if (!hits) {
    return []
  }
  return hits.reduce<number[]>((previous, current) => [...previous, +current.objectID], [])
}
