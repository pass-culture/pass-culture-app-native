import { Activity, VenueResponse } from 'api/gen'
import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { OffersModuleParameters } from 'features/home/types'
import { PlaylistOffersParams } from 'libs/algolia/types'
import { ContentfulLabelCategories } from 'libs/contentful/types'

const ActivityToContentfulLabelMapping: Partial<
  Record<keyof typeof Activity, ContentfulLabelCategories>
> = {
  [Activity.BOOKSTORE]: 'Livres',
  [Activity.RECORD_STORE]: 'Musique',
}

export const getContentfulLabelByActivity = (activity?: Activity | null) => {
  if (!activity) return undefined
  return ActivityToContentfulLabelMapping[activity]
}

export const filterByContentfulLabel = (
  gtlPlaylistConfig: GtlPlaylistRequest[],
  label: ContentfulLabelCategories
) => gtlPlaylistConfig.filter((config) => config.offersModuleParameters.categories?.[0] === label)

export const getLabelFilter = (
  activity?: Activity | null,
  searchGroupLabel?: ContentfulLabelCategories
): ContentfulLabelCategories | undefined => {
  if (!activity && !searchGroupLabel) return undefined
  return searchGroupLabel || getContentfulLabelByActivity(activity)
}

export const filterGtlPlaylistConfigByLabel = (
  gtlPlaylistConfig: GtlPlaylistRequest[],
  activity?: Activity | null,
  searchGroupLabel?: ContentfulLabelCategories
): GtlPlaylistRequest[] => {
  const label = getLabelFilter(activity, searchGroupLabel)
  return label ? filterByContentfulLabel(gtlPlaylistConfig, label) : gtlPlaylistConfig
}

export const getGtlPlaylistsParams = (
  filteredPlaylistConfig: GtlPlaylistRequest[],
  venue: Omit<VenueResponse, 'isVirtual'> | undefined,
  adaptPlaylistParameters: (parameters: OffersModuleParameters) => PlaylistOffersParams
): PlaylistOffersParams[] => {
  return filteredPlaylistConfig.map((config) => {
    const params = adaptPlaylistParameters(config.offersModuleParameters)
    return venue
      ? {
          ...params,
          offerParams: {
            ...params.offerParams,
            venue: {
              venueId: venue.id,
              info: venue.city ?? '',
              label: venue.name,
              isOpenToPublic: venue.isOpenToPublic,
              activity: venue.activity,
            },
          },
        }
      : params
  })
}
