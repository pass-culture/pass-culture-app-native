import { initialSearchState } from 'features/search/context/reducer'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { env } from 'libs/environment'
import { Offer } from 'shared/offer/types'

type fetchOffersByIdsArgs = {
  objectIds: string[]
  isUserUnderage: boolean
}

export const fetchOffersByIds = async ({
  objectIds,
  isUserUnderage,
}: fetchOffersByIdsArgs): Promise<Offer[]> => {
  const index = client.initIndex(env.ALGOLIA_OFFERS_INDEX_NAME)
  const searchParameters = buildOfferSearchParameters(
    { ...initialSearchState, hitsPerPage: objectIds.length, objectIds, query: '' },
    null,
    isUserUnderage
  )

  try {
    const response = await index.search<Offer>('', {
      page: 0,
      hitsPerPage: objectIds.length,
      ...searchParameters,
      attributesToRetrieve: offerAttributesToRetrieve,
      attributesToHighlight: [], // We disable highlighting because we don't need it
    })
    const hits = response.hits.filter(Boolean) as Offer[]
    return hits.filter(({ offer }) => !offer.isEducational)
  } catch (error) {
    captureAlgoliaError(error)
    return [] as Offer[]
  }
}
