import { initialSearchState } from 'features/search/context/reducer'
import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { AlgoliaLocationFilter } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { Offer } from 'shared/offer/types'

type FetchOffersByEanArgs = {
  eanList: string[]
  isUserUnderage: boolean
  locationFilter: AlgoliaLocationFilter
}

export const fetchOffersByEan = async ({
  eanList,
  isUserUnderage,
  locationFilter,
}: FetchOffersByEanArgs): Promise<Offer[]> => {
  const index = client.initIndex(env.ALGOLIA_OFFERS_INDEX_NAME)
  const searchParameters = buildOfferSearchParameters(
    { ...initialSearchState, locationFilter, eanList },
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
