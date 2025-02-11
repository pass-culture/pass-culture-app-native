import { useAlgoliaSimilarOffers } from 'features/offer/api/useAlgoliaSimilarOffers'
import { QueryKeys } from 'libs/queryKeys'
import { Offer } from 'shared/offer/types'

export const useAlgoliaRecommendedOffers = (
  ids: string[],
  moduleId: string,
  shouldPreserveIdsOrder?: boolean
): Offer[] | undefined => {
  return useAlgoliaSimilarOffers(ids, shouldPreserveIdsOrder, [
    QueryKeys.RECOMMENDATION_HITS,
    moduleId,
    ids,
  ])
}
