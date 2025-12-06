import { OfferResponseV2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { env } from 'libs/environment/env'
import { LocationMode } from 'libs/location/types'

export const fetchHeadlineOffersCount = async (offer?: OfferResponseV2) => {
  if (!offer) return

  const searchParameters = buildOfferSearchParameters(
    {
      ...initialSearchState,
      isHeadline: true,
      allocineId: offer.extraData?.allocineId ?? undefined,
      eanList: offer.extraData?.ean ? [offer.extraData.ean] : undefined,
    },
    {
      userLocation: null,
      selectedLocationMode: LocationMode.AROUND_ME,
      aroundMeRadius: 'all',
      aroundPlaceRadius: 'all',
    },
    false
  )

  try {
    const response = await client.searchForHits({
      requests: [
        {
          indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
          query: '',
          page: 0,
          ...searchParameters,
          hitsPerPage: 100,
          attributesToRetrieve: [],
          attributesToHighlight: [],
          distinct: false,
        },
      ],
    })

    return { headlineOffersCount: response.results[0]?.nbHits ?? 0 }
  } catch (error) {
    captureAlgoliaError(error)
    return { headlineOffersCount: 0 }
  }
}
