import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { getSimilarOffersInOrder } from 'features/offer/helpers/getSimilarOffersInOrder/getSimilarOffersInOrder'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { IncompleteSearchHit } from 'libs/algolia'
import { fetchOffersByIds } from 'libs/algolia/fetchAlgolia/fetchOffersByIds'
import { useTransformOfferHits, filterOfferHit } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

export const useAlgoliaSimilarOffers = (
  ids: string[],
  shouldPreserveIdsOrder?: boolean
): Offer[] | undefined => {
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()

  const { data: hits } = useQuery(
    [QueryKeys.SIMILAR_OFFERS, JSON.stringify(ids)],
    () => fetchOffersByIds({ objectIds: ids, isUserUnderage }),
    { enabled: ids.length > 0 }
  )

  return useMemo(() => {
    if (!hits || hits.length === 0) return

    if (shouldPreserveIdsOrder) {
      const offers = getSimilarOffersInOrder(ids, hits)
      return (offers as IncompleteSearchHit[]).filter(filterOfferHit).map(transformHits) as Offer[]
    }

    return (hits as IncompleteSearchHit[]).filter(filterOfferHit).map(transformHits) as Offer[]
  }, [hits, ids, shouldPreserveIdsOrder, transformHits])
}
