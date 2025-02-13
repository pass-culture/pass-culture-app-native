import { initialSearchState } from 'features/search/context/reducer'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { LocationMode } from 'libs/algolia/types'
import { env } from 'libs/environment/env'
import { Position } from 'libs/location'
import { Offer } from 'shared/offer/types'

type FetchOffersByEanArgs = {
  eanList: string[]
  userLocation: Position
  isUserUnderage: boolean
}

export const fetchOffersByEan = async ({
  eanList,
  userLocation,
  isUserUnderage,
}: FetchOffersByEanArgs): Promise<Offer[]> => {
  const index = client.initIndex(env.ALGOLIA_OFFERS_INDEX_NAME)
  const searchParameters = buildOfferSearchParameters(
    { ...initialSearchState, eanList },
    {
      userLocation,
      selectedLocationMode: LocationMode.EVERYWHERE,
      aroundMeRadius: 'all',
      aroundPlaceRadius: 'all',
    },
    isUserUnderage
  )

  try {
    const response = await index.search<Offer>('', {
      page: 0,
      hitsPerPage: eanList.length,
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
