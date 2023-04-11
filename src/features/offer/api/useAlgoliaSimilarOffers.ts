import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { IncompleteSearchHit, Offer } from 'libs/algolia'
import { fetchOfferHits, filterOfferHit, useTransformOfferHits } from 'libs/algolia/fetchAlgolia'
import { QueryKeys } from 'libs/queryKeys'

export const useAlgoliaSimilarOffers = (ids: string[]): Offer[] | undefined => {
  const isUserUnderage = useIsUserUnderage()
  const transformHits = useTransformOfferHits()

  const { data: hits } = useQuery(
    [QueryKeys.SIMILAR_OFFERS, JSON.stringify(ids)],
    () => fetchOfferHits({ objectIds: ids, isUserUnderage }),
    { enabled: ids.length > 0 }
  )

  return useMemo(() => {
    if (!hits || hits.length === 0) return

    return (hits as IncompleteSearchHit[]).filter(filterOfferHit).map(transformHits) as Offer[]
  }, [hits, transformHits])
}
