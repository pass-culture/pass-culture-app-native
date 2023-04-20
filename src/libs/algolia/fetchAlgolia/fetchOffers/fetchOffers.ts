import { captureAlgoliaError } from 'libs/algolia/fetchAlgolia/AlgoliaError'
import { client } from 'libs/algolia/fetchAlgolia/clients'
import { adaptAlgoliaHit } from 'libs/algolia/fetchAlgolia/fetchOffers/adaptAlgoliaHits'
import { adaptOffersWithPage } from 'libs/algolia/fetchAlgolia/fetchOffers/adaptOffersWithPage'
import { buildFetchOffersQueryParameters } from 'libs/algolia/fetchAlgolia/fetchOffers/buildFetchOffersQueryParameters'
import { SearchParametersQuery } from 'libs/algolia/types'
import { env } from 'libs/environment'
import { Position } from 'libs/geolocation'
import { Offer, OffersWithPage } from 'shared/offer/types'

type FetchOfferParameters = {
  parameters: SearchParametersQuery
  userLocation: Position
  isUserUnderage: boolean
  storeQueryID?: (queryID?: string) => void
  excludedObjectIds?: string[]
  indexSearch?: string
  urlPrefix?: string
}

export const fetchOffers = async ({
  parameters,
  userLocation,
  isUserUnderage,
  storeQueryID,
  indexSearch = env.ALGOLIA_OFFERS_INDEX_NAME,
  urlPrefix,
}: FetchOfferParameters): Promise<OffersWithPage> => {
  const index = client.initIndex(indexSearch)

  const algoliaSearchParams = buildFetchOffersQueryParameters({
    parameters,
    userLocation,
    isUserUnderage,
  })

  try {
    const response = await index.search<Offer>(
      algoliaSearchParams.query || '',
      algoliaSearchParams.requestOptions
    )

    if (storeQueryID) storeQueryID(response.queryID)

    const adaptedOffers: Offer[] = adaptAlgoliaHit(response.hits, urlPrefix)
    const adaptedOffersWithPage: OffersWithPage = adaptOffersWithPage({
      offers: adaptedOffers,
      nbOffers: adaptedOffers.length,
      nbPages: response.nbPages,
      page: response.page,
      userData: response.userData,
    })

    return adaptedOffersWithPage
  } catch (error) {
    captureAlgoliaError(error)
    return { offers: [] as Offer[], nbOffers: 0, page: 0, nbPages: 0 }
  }
}
