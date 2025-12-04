import { Activity } from 'api/gen'
import { filterGtlPlaylistConfigByLabel } from 'features/gtlPlaylist/gtlPlaylistHelpers'
import { useGetGTLPlaylistsConfigQuery } from 'features/gtlPlaylist/queries/useGetGTLPlaylistsConfigQuery'
import { getShouldDisplayGtlPlaylist } from 'features/venue/pages/Venue/getShouldDisplayGtlPlaylist'
import { ContentfulLabelCategories } from 'libs/contentful/types'

export const useGetGTLPlaylistsConfigByLabelQuery = (
  searchGroupLabel?: ContentfulLabelCategories,
  activity?: Activity | null
) => {
  const enabledQuery =
    !!searchGroupLabel ||
    getShouldDisplayGtlPlaylist({
      activity,
    })

  return useGetGTLPlaylistsConfigQuery(enabledQuery, (data) =>
    filterGtlPlaylistConfigByLabel(data, activity, searchGroupLabel)
  )
}
