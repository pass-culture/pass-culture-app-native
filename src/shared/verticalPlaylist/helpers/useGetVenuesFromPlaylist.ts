import { useGetVenuesData } from 'features/home/api/useGetVenuesData'
import { VenuesModule } from 'features/home/types'
import { VenueHit } from 'libs/algolia/types'
import { VerticalPlaylistVenuesData } from 'shared/verticalPlaylist/types'

const NO_VENUES: VenueHit[] = []

export const useGetVenuesFromPlaylist = ({
  type,
  id,
  displayParameters,
  venuesParameters,
  data,
}: VenuesModule): VerticalPlaylistVenuesData => {
  const modules = [{ type, id, displayParameters, venuesParameters, data }]
  const { venuesModulesData } = useGetVenuesData(modules)
  const items = (venuesModulesData?.[0]?.playlistItems as VenueHit[]) ?? NO_VENUES
  const title = displayParameters.title
  const subtitle = displayParameters.subtitle
  const nbItems = items.length
  return { title, subtitle, items, nbItems }
}
