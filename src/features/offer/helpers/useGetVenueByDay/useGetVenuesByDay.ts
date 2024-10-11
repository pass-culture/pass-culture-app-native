import { Hit } from '@algolia/client-search'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { OfferResponseV2 } from 'api/gen'
import { useOffersStocks } from 'features/offer/api/useOffersStocks'
import { moviesOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { initialSearchState } from 'features/search/context/reducer'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

const DEFAULT_RADIUS_KM = 50

type Options = Partial<{
  radiusKm: number
  initialCount: number
  nextCount: number
}>

const useFetchOffers = (...params: Parameters<typeof fetchOffers>) => {
  return useQuery({
    queryKey: [QueryKeys.SEARCH_RESULTS, params],
    queryFn: () => fetchOffers(...params),
  })
}

export const useGetVenuesByDay = (date: Date, offer: OfferResponseV2, options?: Options) => {
  const { radiusKm = DEFAULT_RADIUS_KM, initialCount = 6, nextCount = 3 } = options || {}
  const [count, setCount] = useState<number>(initialCount)
  const { userLocation } = useLocation()
  const isUserUnderage = useIsUserUnderage()

  const { data } = useFetchOffers({
    parameters: {
      ...initialSearchState,
      allocineId: offer.extraData?.allocineId ?? undefined,
      date: { selectedDate: date.toISOString(), option: DATE_FILTER_OPTIONS.USER_PICK },
      distinct: false,
    },
    buildLocationParameterParams: {
      userLocation: userLocation ?? {
        latitude: offer.venue.coordinates.latitude ?? 0,
        longitude: offer.venue.coordinates.longitude ?? 0,
      },
      selectedLocationMode: LocationMode.AROUND_ME,
      aroundMeRadius: radiusKm * 1000,
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
    () => moviesOfferBuilder(offersWithStocks?.offers).withMoviesOnDay(date).buildOfferResponse(),
    [date, offersWithStocks?.offers]
  )

  const displayOffers = useMemo(
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
    return displayOffers.length === filteredOffers.length
  }, [displayOffers.length, filteredOffers.length])

  return {
    items: displayOffers,
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
