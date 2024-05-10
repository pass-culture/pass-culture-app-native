import React from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { MoviesScreeningCalendar } from 'features/offer/components/MoviesScreeningCalendar/MoviesScreeningCalendar'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import type { VenueOffers } from 'features/venue/api/useVenueOffers'
import { NoOfferPlaceholder } from 'features/venue/components/Placeholders/NoOfferPlaceholder'
import { VenueOffersList } from 'features/venue/components/VenueOffers/VenueOffersList'
import { OfferPlaylistSkeleton, TileSize } from 'ui/components/placeholders/OfferPlaylistSkeleton'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export interface VenueOffersProps {
  venue: VenueResponse
  venueOffers?: VenueOffers
  playlists?: GtlPlaylistData[]
}

const LoadingState: React.FC = () => (
  <React.Fragment>
    <Spacer.Column numberOfSpaces={6} />
    <OfferPlaylistSkeleton size={TileSize.MEDIUM} numberOfTiles={6} />
  </React.Fragment>
)

const MovieScreening: React.FC<{ venueOffers: VenueOffers }> = ({ venueOffers }) => {
  const { isDesktopViewport } = useTheme()
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={isDesktopViewport ? 10 : 6} />
      <MoviesTitle>{'Les films à l’affiche'}</MoviesTitle>
      <Spacer.Column numberOfSpaces={isDesktopViewport ? 10 : 6} />
      <MoviesScreeningCalendar venueOffers={venueOffers} />
    </React.Fragment>
  )
}

export function VenueOffers({ venue, venueOffers, playlists }: Readonly<VenueOffersProps>) {
  const { isLoading: areVenueOffersLoading } = useVenueOffers(venue)
  const { isLoading: arePlaylistsLoading } = useGTLPlaylists({ venue })
  const isOfferAMovieScreening = venueOffers?.hits.some(
    (offer) => offer.offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  )
  // const enableNewXpCine =  useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_NEW_XP_CINE_FROM_VENUE)
  const enableNewXpCine = true

  switch (true) {
    case areVenueOffersLoading || arePlaylistsLoading:
      return <LoadingState />

    case !venue || !venueOffers || venueOffers.hits.length === 0:
      return <NoOfferPlaceholder />

    case isOfferAMovieScreening && enableNewXpCine:
      // we are sure that venueOffers is defined here because of the previous case,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return <MovieScreening venueOffers={venueOffers!} />
    default:
      return <VenueOffersList venue={venue} venueOffers={venueOffers} playlists={playlists} />
  }
}

const MoviesTitle = styled(Typo.Title3).attrs(getHeadingAttrs(2))({
  marginLeft: getSpacing(6),
})
