import { useRoute } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { OfferPagePlaylist, OfferResponse } from 'api/gen'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { OfferPlaylistSection } from 'features/offer/components/OfferPlaylistList/OfferPlaylistSection'
import { PlaylistType } from 'features/offer/enums'
import { useIsLandscape } from 'shared/useIsLandscape/useIsLandscape'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

export type OfferPlaylistListProps = {
  offer: OfferResponse
  playlists?: OfferPagePlaylist[]
  seeAllButton: {
    navigateToVerticalPlaylist: (
      type: PlaylistType | string
    ) => InternalNavigationProps['navigateTo']
    onBeforeNavigate: (type: PlaylistType | string, title?: string) => void
    hidePlaylistSeeAll?: boolean
    hideSearchSeeAll?: boolean
  }
}

export function OfferPlaylistList({ offer, playlists, seeAllButton }: OfferPlaylistListProps) {
  const isLandscape = useIsLandscape()
  const route = useRoute<UseRouteType<'Offer'>>()
  const fromOfferId = route.params.fromOfferId

  const hasPlaylists = !!(playlists && playlists.length > 0)

  return (
    <StyledSectionWithDivider visible={hasPlaylists} gap={8}>
      {playlists?.map((playlist, index) => (
        <OfferPlaylistSection
          key={`${playlist.analyticsPlaylistType}-${index}`}
          playlist={playlist}
          playlistIndex={index}
          offer={offer}
          fromOfferId={fromOfferId}
          seeAllButton={seeAllButton}
        />
      ))}
      {isLandscape ? <PlaceholderBehindButton /> : null}
    </StyledSectionWithDivider>
  )
}

const StyledSectionWithDivider = styled(SectionWithDivider)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const PlaceholderBehindButton = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.xxxxl,
}))
