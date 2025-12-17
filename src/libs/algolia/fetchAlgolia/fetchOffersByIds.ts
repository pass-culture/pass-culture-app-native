import { initialSearchState } from 'features/search/context/reducer'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { LocationMode } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { Offer } from 'shared/offer/types'

type fetchOffersByIdsArgs = {
  objectIds: string[]
  isUserUnderage: boolean
}

export const fetchOffersByIds = async ({
  objectIds,
  isUserUnderage,
}: fetchOffersByIdsArgs): Promise<Offer[]> => {
  const searchParameters = buildOfferSearchParameters(
    {
      ...initialSearchState,
      hitsPerPage: objectIds.length,
      objectIds,
      query: '',
    },
    {
      selectedLocationMode: LocationMode.EVERYWHERE,
      userLocation: null,
      aroundMeRadius: 'all',
      aroundPlaceRadius: 'all',
    },
    isUserUnderage
  )

  try {
    const response = await client.searchForHits<Offer>({
      requests: [
        {
          indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
          query: '',
          page: 0,
          hitsPerPage: objectIds.length,
          ...searchParameters,
          attributesToRetrieve: offerAttributesToRetrieve,
          attributesToHighlight: [], // We disable highlighting because we don't need it
        },
      ],
    })
    const hits = (response.results[0]?.hits ?? []).filter(Boolean) as Offer[]
    return hits.filter(({ offer }) => !offer.isEducational)
  } catch (error) {
    captureAlgoliaError(error)
    return [] as Offer[]
  }
}
