import { initialSearchState } from 'features/search/context/reducer'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { OfferModuleQuery, SearchQueryParameters } from 'libs/algolia/types'
import { env } from 'libs/environment/env'

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
  if (!offerId && !tag) return

  const payload: SearchQueryParameters & { objectIds?: string[] } = {
    ...initialSearchState,
    hitsPerPage: 1,
    query: '',
  }
  if (tag) {
    payload.tags = [tag]
  } else if (offerId) {
    payload.objectIds = [offerId]
  }

  return {
    indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
    query: '',
    ...buildOfferSearchParameters(payload, locationParams, isUserUnderage),
    attributesToHighlight: [], // We disable highlighting because we don't need it
    attributesToRetrieve: offerAttributesToRetrieve,
  }
}
