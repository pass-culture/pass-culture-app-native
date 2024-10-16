import { Hit } from '@algolia/client-search'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { OfferResponseV2 } from 'api/gen'
import { useFetchOffers } from 'features/offer/api/useFetchOffers'
import { useOffersStocks } from 'features/offer/api/useOffersStocks'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { initialSearchState } from 'features/search/context/reducer'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { Offer } from 'shared/offer/types'

const DEFAULT_RADIUS_KM = 50

type Options = Partial<{
  radiusKm: number
  initialCount: number
  nextCount: number
}>

export const useGetVenuesByDay = (date: Date, offer: OfferResponseV2, options?: Options) => {
  const { radiusKm = DEFAULT_RADIUS_KM, initialCount = 6, nextCount = 3 } = options || {}
  const [count, setCount] = useState<number>(initialCount)
  const { userLocation } = useLocation()
  const isUserUnderage = useIsUserUnderage()

  const location = useMemo(
    () =>
      userLocation ?? {
        latitude: offer.venue.coordinates.latitude ?? 0,
        longitude: offer.venue.coordinates.longitude ?? 0,
      },
    [offer.venue.coordinates.latitude, offer.venue.coordinates.longitude, userLocation]
  )

  const { data } = useFetchOffers({
    parameters: {
      ...initialSearchState,
      allocineId: offer.extraData?.allocineId ?? undefined,
      date: { selectedDate: date.toISOString(), option: DATE_FILTER_OPTIONS.USER_PICK },
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

  const filteredOffers = useMemo(
    () =>
      moviesOfferBuilder(offersWithStocks?.offers)
        .withMoviesOnDay(date)
        .sortedByDistance(location)
        .buildOfferResponse(),
    [date, location, offersWithStocks?.offers]
  )

  const displayOffers = filteredOffers.slice(0, count)

  const increaseCount = useCallback(
    () =>
      setCount((count) => {
        const newCount = count + nextCount
        return Math.max(newCount, filteredOffers.length)
      }),
    [filteredOffers.length, nextCount]
  )

  const isEnd = useMemo(() => {
    return displayOffers.length === filteredOffers.length
  }, [displayOffers.length, filteredOffers.length])

  return {
    items: displayOffers,
    isLoading,
    increaseCount,
    isEnd,
  }
}

const extractOfferIdsFromHits = (hits: Hit<Offer>[] | undefined) => {
  if (!hits) {
    return []
  }
  return hits.reduce<number[]>((previous, current) => [...previous, +current.objectID], [])
}
