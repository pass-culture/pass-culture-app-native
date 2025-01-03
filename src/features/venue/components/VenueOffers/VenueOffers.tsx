import React, { useEffect } from 'react'
import { InView } from 'react-native-intersection-observer'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { MoviesScreeningCalendar } from 'features/offer/components/MoviesScreeningCalendar/MoviesScreeningCalendar'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { NoOfferPlaceholder } from 'features/venue/components/Placeholders/NoOfferPlaceholder'
import { VenueOffersList } from 'features/venue/components/VenueOffers/VenueOffersList'
import type { VenueOffersArtists, VenueOffers as VenueOffersType } from 'features/venue/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Anchor } from 'ui/components/anchor/Anchor'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { OfferPlaylistSkeleton, TileSize } from 'ui/components/placeholders/OfferPlaylistSkeleton'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export interface VenueOffersProps {
  venue: VenueResponse
  venueArtists?: VenueOffersArtists
  venueOffers?: VenueOffersType
  playlists?: GtlPlaylistData[]
}

const cinemaCTAButtonName = 'Accéder aux séances'

const LoadingState: React.FC = () => (
  <React.Fragment>
    <Spacer.Column numberOfSpaces={6} />
    <OfferPlaylistSkeleton size={TileSize.MEDIUM} numberOfTiles={6} />
  </React.Fragment>
)

const MovieScreening: React.FC<{ venueOffers: VenueOffersType }> = ({ venueOffers }) => {
  const { isDesktopViewport } = useTheme()
  const { setButton, showButton } = useOfferCTA()
  const scrollToAnchor = useScrollToAnchor()

  useEffect(() => {
    setButton(cinemaCTAButtonName, () => {
      scrollToAnchor('venue-cine-availabilities')
    })

    return () => {
      setButton('', () => null)
    }
  }, [scrollToAnchor, setButton])

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={isDesktopViewport ? 10 : 6} />
      <Anchor name="venue-cine-availabilities">
        <InView
          onChange={(inView) => {
            showButton(!inView)
          }}>
          <MoviesTitle>{'Les films à l’affiche'}</MoviesTitle>
        </InView>
      </Anchor>
      <Spacer.Column numberOfSpaces={isDesktopViewport ? 10 : 6} />
      <MoviesScreeningCalendar venueOffers={venueOffers} />
    </React.Fragment>
  )
}

export function VenueOffers({
  venue,
  venueArtists,
  venueOffers,
  playlists,
}: Readonly<VenueOffersProps>) {
  const { isLoading: areVenueOffersLoading } = useVenueOffers(venue)
  const { isLoading: arePlaylistsLoading } = useGTLPlaylists({
    venue,
    queryKey: 'VENUE_GTL_PLAYLISTS',
  })
  const isOfferAMovieScreening = venueOffers?.hits.some(
    (offer) => offer.offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE
  )
  const enableCine = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_NEW_XP_CINE_FROM_VENUE)

  if (areVenueOffersLoading || arePlaylistsLoading) {
    return <LoadingState />
  }

  if (!venue || !venueOffers || venueOffers.hits.length === 0) {
    return <NoOfferPlaceholder />
  }

  if (isOfferAMovieScreening && enableCine) {
    return <MovieScreening venueOffers={venueOffers} />
  }

  return (
    <VenueOffersList
      venue={venue}
      venueArtists={venueArtists}
      venueOffers={venueOffers}
      playlists={playlists}
    />
  )
}

const MoviesTitle = styled(TypoDS.Title3).attrs(getHeadingAttrs(2))({
  marginLeft: getSpacing(6),
})
