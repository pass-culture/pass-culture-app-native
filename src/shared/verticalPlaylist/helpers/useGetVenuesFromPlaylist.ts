import { useGetVenuesData } from 'features/home/api/useGetVenuesData'
import { VenueHit } from 'libs/algolia/types'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'
import { VerticalPlaylistVenuesData } from 'shared/verticalPlaylist/types'

const NO_VENUES: VenueHit[] = []

export const useGetVenuesFromPlaylist = ({ module }): VerticalPlaylistVenuesData => {
  const { type, id, displayParameters, venuesParameters, data } = module

  const isThematicSearch = type === VerticalPlaylist.ThematicSearchVenues
  const isHomeModule = type === VerticalPlaylist.ModuleVenues

  const modules = isThematicSearch ? [] : [{ type, id, displayParameters, venuesParameters, data }]
  const { venuesModulesData } = useGetVenuesData(modules)

  // Use of 'as VenueHit[]' because playlistItems type is VenueHit[] | Offer[] from ModuleData
  const homeItems: VenueHit[] = (venuesModulesData?.[0]?.playlistItems as VenueHit[]) ?? NO_VENUES
  const searchItems: VenueHit[] = (data ?? NO_VENUES).map(normalizeVenue)

  const { title, subtitle } = displayParameters
  const items = isThematicSearch ? searchItems : homeItems
  const nbItems = items.length

  const hasHomeDataError = isHomeModule && (!venuesModulesData || !venuesModulesData[0])
  const hasSearchDataError = isThematicSearch && !Array.isArray(data)
  const hasDataError = hasHomeDataError || hasSearchDataError

  return { title, subtitle, items, nbItems, hasDataError }
}

const normalizeVenue = (venue): VenueHit => ({
  ...venue,
  bannerUrl: venue.banner_url,
  id: venue.objectID,
})
