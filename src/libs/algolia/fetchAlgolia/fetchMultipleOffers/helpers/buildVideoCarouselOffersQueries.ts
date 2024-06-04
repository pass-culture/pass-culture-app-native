import { initialSearchState } from 'features/search/context/reducer'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { OfferModuleQuery } from 'libs/algolia/types'
import { env } from 'libs/environment'

type buildVideoCarouselOffersQueriesArgs = {
  tag?: string
  offerId?: string
  isUserUnderage: boolean
  locationParams: BuildLocationParameterParams
}

export const buildVideoCarouselOffersQueries = ({
  tag,
  offerId,
  isUserUnderage,
  locationParams,
}: buildVideoCarouselOffersQueriesArgs): OfferModuleQuery | undefined => {
  if (tag)
    return {
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
      query: '',
      params: {
        ...buildOfferSearchParameters(
          { ...initialSearchState, hitsPerPage: 1, tags: [tag], query: '' },
          locationParams,
          isUserUnderage
        ),
        attributesToHighlight: [], // We disable highlighting because we don't need it
        attributesToRetrieve: offerAttributesToRetrieve,
      },
    }
  else if (offerId)
    return {
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
      query: '',
      params: {
        ...buildOfferSearchParameters(
          { ...initialSearchState, hitsPerPage: 1, objectIds: [offerId], query: '' },
          locationParams,
          isUserUnderage
        ),
        attributesToHighlight: [], // We disable highlighting because we don't need it
        attributesToRetrieve: offerAttributesToRetrieve,
      },
    }
  return
}
