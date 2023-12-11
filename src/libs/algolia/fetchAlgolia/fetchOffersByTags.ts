import { initialSearchState } from 'features/search/context/reducer'
import { fetchOffers } from 'libs/algolia/fetchAlgolia/fetchOffers'
import { AlgoliaLocationFilter } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'

type FetchOffersByTagsArgs = {
  tags: string[]
  isUserUnderage: boolean
  locationFilter: AlgoliaLocationFilter
}

export const fetchOffersByTags = async ({
  tags,
  isUserUnderage,
  locationFilter,
}: FetchOffersByTagsArgs): Promise<Offer[]> => {
  const { hits: offers } = await fetchOffers({
    parameters: { ...initialSearchState, locationFilter, tags, hitsPerPage: tags.length },
    isUserUnderage,
  })
  return offers as Offer[]
}
