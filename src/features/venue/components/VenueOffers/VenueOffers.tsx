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
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { OfferPlaylistSkeleton, TileSize } from 'ui/components/placeholders/OfferPlaylistSkeleton'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export interface VenueOffersProps {
  venue: VenueResponse
  venueOffers?: VenueOffers
  playlists?: GtlPlaylistData[]
}

export const LoadingState: React.FC = () => (
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
  const { isLoading: arePlaylistsLoading } = useGTLPlaylists({
    venue,
    queryKey: 'VENUE_GTL_PLAYLISTS',
  })
  const isOfferAMovieScreening = venueOffers?.hits.some(
    (offer) => offer.offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  )
  const enableNewXpCine = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_NEW_XP_CINE_FROM_VENUE)

  if (areVenueOffersLoading || arePlaylistsLoading) {
    return <LoadingState />
  }

  if (!venue || !venueOffers || venueOffers.hits.length === 0) {
    return <NoOfferPlaceholder />
  }

  if (isOfferAMovieScreening && enableNewXpCine) {
    return <MovieScreening venueOffers={venueOffers} />
  }

  return <VenueOffersList venue={venue} venueOffers={venueOffers} playlists={playlists} />
}

const MoviesTitle = styled(TypoDS.Title3).attrs(getHeadingAttrs(2))({
  marginLeft: getSpacing(6),
})
