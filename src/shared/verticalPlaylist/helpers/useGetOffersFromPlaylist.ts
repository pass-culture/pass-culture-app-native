import { useGetOffersDataQuery } from 'features/home/queries/useGetOffersDataQuery'
import { OffersModule } from 'features/home/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { VenueHit } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'
import { VerticalPlaylistOffersData } from 'shared/verticalPlaylist/types'

const isOfferModule = (items: Offer[] | VenueHit[]): items is Offer[] => {
  const firstItem = items[0]
  return firstItem !== undefined && 'objectID' in firstItem
}

const NO_OFFERS: Offer[] = []

export const useGetOffersFromPlaylist = ({
  type,
  id,
  title,
  offersModuleParameters,
  displayParameters,
  data,
  recommendationParameters,
}: OffersModule): VerticalPlaylistOffersData => {
  const modules = [
    { type, id, title, offersModuleParameters, displayParameters, data, recommendationParameters },
  ]
  const { searchState } = useSearch()
  const moduleData = useGetOffersDataQuery(modules)
  const rawItems = moduleData?.[0]?.playlistItems ?? NO_OFFERS
  const items = isOfferModule(rawItems) ? rawItems : NO_OFFERS

  return {
    items,
    title: displayParameters.title ?? title,
    subtitle: displayParameters.subtitle,
    searchId: searchState.searchId,
    searchQuery: searchState.query,
  }
}
