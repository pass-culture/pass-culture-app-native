import { initialSearchState } from 'features/search/context/reducer'
import { SearchHit } from 'libs/algolia'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters.ts'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { env } from 'libs/environment'

type FetchOfferHitsArgs = {
  objectIds: string[]
  isUserUnderage: boolean
}

export const fetchOfferHits = async ({
  objectIds,
  isUserUnderage,
}: FetchOfferHitsArgs): Promise<SearchHit[]> => {
  const index = client.initIndex(env.ALGOLIA_OFFERS_INDEX_NAME)
  const searchParameters = buildOfferSearchParameters(
    { ...initialSearchState, hitsPerPage: objectIds.length, objectIds, query: '' },
    null,
    isUserUnderage
  )

  try {
    const response = await index.search<SearchHit>('', {
      page: 0,
      hitsPerPage: objectIds.length,
      ...searchParameters,
      attributesToRetrieve: offerAttributesToRetrieve,
      attributesToHighlight: [], // We disable highlighting because we don't need it
    })
    const hits = response.hits.filter(Boolean) as SearchHit[]
    return hits.filter(({ offer }) => !offer.isEducational)
  } catch (error) {
    captureAlgoliaError(error)
    return [] as SearchHit[]
  }
}
