import { useAlgoliaSimilarOffersQuery } from 'features/offer/queries/useAlgoliaSimilarOffersQuery'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

export const useAlgoliaRecommendedOffers = (
  ids: string[],
  moduleId: string,
  shouldPreserveIdsOrder?: boolean
): Offer[] | undefined => {
  return useAlgoliaSimilarOffersQuery(ids, shouldPreserveIdsOrder, [
    QueryKeys.RECOMMENDATION_HITS,
    moduleId,
    ids,
  ])
}
