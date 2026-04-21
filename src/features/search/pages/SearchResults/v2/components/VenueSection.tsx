import { useIsFocused } from '@react-navigation/native'
import React, { FC } from 'react'
import { ViewToken } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { VenuePlaylist } from 'features/search/components/VenuePlaylist/VenuePlaylist'
import { SearchListProps } from 'features/search/types'
import { AlgoliaVenueOfferListItem, LocationMode } from 'libs/algolia/types'
import { useLocation } from 'libs/location/location'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'

type Props = {
  onViewableVenuePlaylistItemsChanged?: SearchListProps['onViewableVenuePlaylistItemsChanged']
  venues: AlgoliaVenueOfferListItem[]
  withMargins: boolean
}
export const VenueSection: FC<Props> = ({
  onViewableVenuePlaylistItemsChanged,
  venues,
  withMargins,
}) => {
  const isFocused = useIsFocused()
  const { selectedLocationMode } = useLocation()

  const isLocated = selectedLocationMode !== LocationMode.EVERYWHERE

  const handleVenuePlaylistViewableItemsChanged = (items: Pick<ViewToken, 'key' | 'index'>[]) => {
    if (!isFocused) return
    onViewableVenuePlaylistItemsChanged?.(items, 'searchResultsVenuePlaylist', 'venue', 0)
  }

  if (!venues.length) return null

  return (
    <IOScrollView>
      <ObservedPlaylist onViewableItemsChanged={handleVenuePlaylistViewableItemsChanged}>
        {({ listRef, handleViewableItemsChanged }) => (
          <StyledVenuePlaylist
            venuePlaylistTitle="Les lieux culturels"
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
