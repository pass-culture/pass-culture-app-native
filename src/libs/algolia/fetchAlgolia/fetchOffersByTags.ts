import { initialSearchState } from 'features/search/context/reducer'
import { fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers'
import { LocationMode } from 'libs/algolia/types'
import { Position } from 'libs/location/location'
import { Offer } from 'shared/offer/types'

type FetchOffersByTagsArgs = {
  tags: string[]
  userLocation: Position
  isUserUnderage: boolean
}

export const fetchOffersByTags = async ({
  tags,
  userLocation,
  isUserUnderage,
}: FetchOffersByTagsArgs): Promise<Offer[]> => {
  const { hits: offers } = await fetchOffers({
    parameters: { ...initialSearchState, tags, hitsPerPage: tags.length },
    buildLocationParameterParams: {
      userLocation,
      selectedLocationMode: LocationMode.EVERYWHERE,
      aroundMeRadius: 'all',
      aroundPlaceRadius: 'all',
    },
    isUserUnderage,
  })
  return offers as Offer[]
}
