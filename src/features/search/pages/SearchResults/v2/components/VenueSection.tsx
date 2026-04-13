import { useIsFocused } from '@react-navigation/native'
import React, { FC } from 'react'
import { ViewToken } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { VenuePlaylist } from 'features/search/components/VenuePlaylist/VenuePlaylist'
import { getSearchVenuePlaylistTitle } from 'features/search/helpers/getSearchVenuePlaylistTitle/getSearchVenuePlaylistTitle'
import { SearchListProps, VenuesUserData } from 'features/search/types'
import { AlgoliaVenueOfferListItem, LocationMode } from 'libs/algolia/types'
import { useLocation } from 'libs/location/location'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'

type Props = {
  onViewableVenuePlaylistItemsChanged?: SearchListProps['onViewableVenuePlaylistItemsChanged']
  venues: AlgoliaVenueOfferListItem[]
  venuesUserData: VenuesUserData
  withMargins: boolean
}
export const VenueSection: FC<Props> = ({
  onViewableVenuePlaylistItemsChanged,
  venues,
  venuesUserData,
  withMargins,
}) => {
  const isFocused = useIsFocused()
  const { selectedLocationMode } = useLocation()
  const { disabilities } = useAccessibilityFiltersContext()

  const isLocated = selectedLocationMode !== LocationMode.EVERYWHERE

  const handleVenuePlaylistViewableItemsChanged = (items: Pick<ViewToken, 'key' | 'index'>[]) => {
    if (!isFocused) return
    onViewableVenuePlaylistItemsChanged?.(items, 'searchResultsVenuePlaylist', 'venue', 0)
  }

  const shouldDisplayAccessibilityContent = Object.values(disabilities).filter(Boolean).length > 0
  const venuePlaylistTitle = getSearchVenuePlaylistTitle(
    shouldDisplayAccessibilityContent,
    venuesUserData?.[0]?.venue_playlist_title,
    isLocated
  )

  if (!venues.length) return null

  return (
    <IOScrollView>
      <ObservedPlaylist onViewableItemsChanged={handleVenuePlaylistViewableItemsChanged}>
        {({ listRef, handleViewableItemsChanged }) => (
          <StyledVenuePlaylist
            venuePlaylistTitle={venuePlaylistTitle}
            venues={venues}
            isLocated={isLocated}
            playlistRef={listRef}
            onViewableItemsChanged={handleViewableItemsChanged}
            withMargins={withMargins}
          />
        )}
      </ObservedPlaylist>
    </IOScrollView>
  )
}

const StyledVenuePlaylist = styled(VenuePlaylist)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
