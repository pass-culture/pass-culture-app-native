import { VenueTypeCodeKey, VenueResponse } from 'api/gen'
import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { OffersModuleParameters, PlaylistOffersParams } from 'features/home/types'
import { ContentfulLabelCategories } from 'libs/contentful/types'

export const VenueTypeToContentfulLabelMapping: Partial<
  Record<keyof typeof VenueTypeCodeKey, ContentfulLabelCategories>
> = {
  [VenueTypeCodeKey.BOOKSTORE]: 'Livres',
  [VenueTypeCodeKey.RECORD_STORE]: 'Musique',
}

export const getContentfulLabelByVenueType = (venueTypeCode?: VenueTypeCodeKey | null) => {
  if (!venueTypeCode) return undefined
  return VenueTypeToContentfulLabelMapping[venueTypeCode]
}

export const filterByContentfulLabel = (
  playlistConfig: GtlPlaylistRequest[],
  label: ContentfulLabelCategories
) => playlistConfig.filter((config) => config.offersModuleParameters.categories?.[0] === label)

export const getLabelFilter = (
  venueTypeCode?: VenueTypeCodeKey | null,
  searchGroupLabel?: ContentfulLabelCategories
): ContentfulLabelCategories | undefined => {
  if (!venueTypeCode && !searchGroupLabel) return undefined
  return searchGroupLabel || getContentfulLabelByVenueType(venueTypeCode)
}

export const filterGtlPlaylistConfigByLabel = (
  playlistConfig: GtlPlaylistRequest[],
  venueTypeCode?: VenueTypeCodeKey | null,
  searchGroupLabel?: ContentfulLabelCategories
): GtlPlaylistRequest[] => {
  const label = getLabelFilter(venueTypeCode, searchGroupLabel)
  return label ? filterByContentfulLabel(playlistConfig, label) : playlistConfig
}

export const getGtlPlaylistsParams = (
  filteredPlaylistConfig: GtlPlaylistRequest[],
  venue: VenueResponse | undefined,
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
            },
          },
        }
      : params
  })
}
