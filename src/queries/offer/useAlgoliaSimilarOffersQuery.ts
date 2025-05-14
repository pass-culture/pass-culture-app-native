import { useMemo } from 'react'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import {
  filterOfferHitWithImage,
  useTransformOfferHits,
} from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaOffer } from 'libs/algolia/types'
import { QueryKeys } from 'libs/queryKeys'
import { getSimilarOrRecoOffersInOrder } from 'shared/offer/getSimilarOrRecoOffersInOrder'
import { Offer } from 'shared/offer/types'

export const useAlgoliaSimilarOffersQuery = (
  ids: string[],
  shouldPreserveIdsOrder?: boolean,
  queryKey?: UseQueryOptions['queryKey']
): Offer[] | undefined => {
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()

  const { data: hits } = useQuery(
    queryKey ?? [QueryKeys.ALGOLIA_SIMILAR_OFFERS, JSON.stringify(ids)],
    () => fetchOffersByIds({ objectIds: ids, isUserUnderage }),
    { enabled: ids.length > 0 }
  )

  return useMemo(() => {
    if (!hits || hits.length === 0) return

    if (shouldPreserveIdsOrder) {
      const offers = getSimilarOrRecoOffersInOrder(ids, hits)
      return (offers as AlgoliaOffer[])
        .filter(filterOfferHitWithImage)
        .map(transformHits) as Offer[]
    }

    return (hits as AlgoliaOffer[]).filter(filterOfferHitWithImage).map(transformHits) as Offer[]
  }, [hits, ids, shouldPreserveIdsOrder, transformHits])
}
