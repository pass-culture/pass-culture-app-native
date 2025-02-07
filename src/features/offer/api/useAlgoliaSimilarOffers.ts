import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import { filterOfferHit, useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { AlgoliaHit } from 'libs/algolia/types'
import { QueryKeys } from 'libs/queryKeys'
import { getSimilarOrRecoOffersInOrder } from 'shared/offer/getSimilarOrRecoOffersInOrder'
import { Offer } from 'shared/offer/types'

export const useAlgoliaSimilarOffers = (
  ids: string[],
  shouldPreserveIdsOrder?: boolean
): Offer[] | undefined => {
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()

  const { data: hits } = useQuery(
    [QueryKeys.ALGOLIA_SIMILAR_OFFERS, JSON.stringify(ids)],
    () => fetchOffersByIds({ objectIds: ids, isUserUnderage }),
    { enabled: ids.length > 0 }
  )

  return useMemo(() => {
    if (!hits || hits.length === 0) return

    if (shouldPreserveIdsOrder) {
      const offers = getSimilarOrRecoOffersInOrder(ids, hits)
      return (offers as AlgoliaHit[]).filter(filterOfferHit).map(transformHits) as Offer[]
    }

    return (hits as AlgoliaHit[]).filter(filterOfferHit).map(transformHits) as Offer[]
  }, [hits, ids, shouldPreserveIdsOrder, transformHits])
}
