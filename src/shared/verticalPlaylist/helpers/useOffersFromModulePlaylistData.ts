import { useGetOffersDataQuery } from 'features/home/queries/useGetOffersDataQuery'
import { OffersModule } from 'features/home/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { VenueHit } from 'libs/algolia/types'
import { Offer } from 'shared/offer/types'

const isOfferModule = (items: Offer[] | VenueHit[]): items is Offer[] => {
  const firstItem = items[0]
  return firstItem !== undefined && 'objectID' in firstItem
}

const NO_OFFERS: Offer[] = []

type Props = { module: OffersModule }

export const useOffersFromModulePlaylistData = ({ module }: Props) => {
  const { searchState } = useSearch()
  const moduleData = useGetOffersDataQuery([module])
  const rawItems = moduleData?.[0]?.playlistItems ?? NO_OFFERS
  const items = isOfferModule(rawItems) ? rawItems : NO_OFFERS

  return {
    items,
    title: module.displayParameters?.title ?? '',
    subtitle: module.displayParameters?.subtitle ?? '',
    searchId: searchState.searchId,
    searchQuery: searchState.query,
  }
}
