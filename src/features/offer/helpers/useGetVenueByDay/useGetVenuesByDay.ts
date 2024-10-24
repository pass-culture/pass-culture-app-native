import { Hit } from '@algolia/client-search'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { OfferResponseV2 } from 'api/gen'
import { useFetchOffers } from 'features/offer/api/useFetchOffers'
import { useOffersStocks } from 'features/offer/api/useOffersStocks'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { initialSearchState } from 'features/search/context/reducer'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { Offer } from 'shared/offer/types'

const DEFAULT_RADIUS_KM = 50

type Options = Partial<{
  radiusKm: number
  initialCount: number
  nextCount: number
}>

export const useGetVenuesByDay = (date: Date, offer?: OfferResponseV2, options?: Options) => {
  const { radiusKm = DEFAULT_RADIUS_KM, initialCount = 6, nextCount = 3 } = options || {}
  const [count, setCount] = useState<number>(initialCount)
  const { userLocation } = useLocation()
  const isUserUnderage = useIsUserUnderage()

  const location = useMemo(
    () =>
      userLocation ?? {
        latitude: offer?.venue.coordinates.latitude ?? 0,
        longitude: offer?.venue.coordinates.longitude ?? 0,
      },
    [offer?.venue.coordinates.latitude, offer?.venue.coordinates.longitude, userLocation]
  )

  const { data } = useFetchOffers({
    parameters: {
      ...initialSearchState,
      allocineId: offer?.extraData?.allocineId ?? undefined,
      distinct: false,
    },
    buildLocationParameterParams: {
      userLocation: location,
      selectedLocationMode: LocationMode.AROUND_ME,
      aroundMeRadius: radiusKm,
      aroundPlaceRadius: 'all',
    },
    isUserUnderage,
  })

  const offerIds = extractOfferIdsFromHits(data?.hits)
  const { data: offersWithStocks, isLoading } = useOffersStocks({ offerIds })

  useEffect(() => {
    setCount(initialCount)
  }, [date, initialCount])

  const dayOffers = useMemo(
    () =>
      moviesOfferBuilder(offersWithStocks?.offers)
        .withoutMoviesAfter15Days()
        .sortedByDistance(location)
        .withMoviesOnDay(date)
        .build(),
    [date, location, offersWithStocks?.offers]
  )

  const nextOffers = useMemo(() => {
    return moviesOfferBuilder(offersWithStocks?.offers)
      .withoutMoviesAfter15Days()
      .sortedByDistance(location)
      .withoutMoviesOnDay(date)
      .withNextScreeningFromDate(date)
      .build()
  }, [date, location, offersWithStocks?.offers])

  const after15DaysOffers = useMemo(
    () =>
      moviesOfferBuilder(offersWithStocks?.offers)
        .withMoviesAfter15Days()
        .sortedByDistance(location)
        .build(),
    [location, offersWithStocks?.offers]
  )

  const movieOffers = useMemo(
    () => [...dayOffers, ...nextOffers, ...after15DaysOffers],
    [dayOffers, nextOffers, after15DaysOffers]
  )

  const displayedOffers = useMemo(
    () => (count === movieOffers.length ? movieOffers : movieOffers.slice(0, count)),
    [count, movieOffers]
  )

  const increaseCount = useCallback(
    () =>
      setCount((count) => {
        const newCount = count + nextCount
        return Math.max(newCount, displayedOffers.length)
      }),
    [displayedOffers.length, nextCount]
  )

  const isEnd = useMemo(() => {
    return (
      displayedOffers.length === dayOffers.length + nextOffers.length + after15DaysOffers.length
    )
  }, [displayedOffers.length, dayOffers.length, nextOffers.length, after15DaysOffers.length])

  const hasStocksOnlyAfter15Days = useMemo(
    () => !dayOffers.length && !nextOffers.length && after15DaysOffers.length > 0,
    [after15DaysOffers.length, dayOffers.length, nextOffers.length]
  )

  return {
    items: displayedOffers,
    isLoading,
    increaseCount,
    isEnd,
    hasStocksOnlyAfter15Days,
  }
}

const extractOfferIdsFromHits = (hits: Hit<Offer>[] | undefined) => {
  if (!hits) {
    return []
  }
  return hits.reduce<number[]>((previous, current) => [...previous, +current.objectID], [])
}
