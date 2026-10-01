import { useIsFocused } from '@react-navigation/native'
import React, { FC } from 'react'
import { IOScrollView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { useSearch } from 'features/search/context/SearchWrapper'
import { removeGeolocFromVenue } from 'features/search/helpers/searchList/removeGeolocFromVenue'
import { VenuePlaylist } from 'features/search/pages/SearchResults/v2/components/SearchPlaylists/VenuesPlaylist'
import { hasActiveSearchFilters } from 'features/search/queries/helpers'
import { selectSearchVenues } from 'features/search/queries/useSearchVenuesQuery/selectors/selectSearchVenues'
import { useSearchVenuesQuery } from 'features/search/queries/useSearchVenuesQuery/useSearchVenuesQuery'
import { FetchSearchResultsArgs } from 'features/search/types'
import { LocationMode } from 'libs/algolia/types'
import { logViewItem } from 'libs/analytics/helpers/logViewItem'
import { useLocationMode } from 'libs/locationV2/location.store'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'

type Props = {
  withMargins: boolean
  searchFilters: FetchSearchResultsArgs
}
export const VenuesPlaylistContainer: FC<Props> = ({ withMargins, searchFilters }) => {
  const isFocused = useIsFocused()
  const {
    searchState: { searchId },
  } = useSearch()
  const selectedLocationMode = useLocationMode()
  const isLocated = selectedLocationMode !== LocationMode.EVERYWHERE

  const { data: venuesResponse } = useSearchVenuesQuery(searchFilters, {
    select: (venuesResponse) => selectSearchVenues(venuesResponse),
  })

  const hasSelectedSearchFilters = hasActiveSearchFilters(searchFilters)

  const venues = venuesResponse?.venues || []
  const venueNotOpenToPublic = venuesResponse?.venueNotOpenToPublic
  const searchResultVenues = venueNotOpenToPublic?.[0]
    ? [removeGeolocFromVenue(venueNotOpenToPublic?.[0]), ...venues]
    : venues

  if (!searchResultVenues.length || hasSelectedSearchFilters) return null

  return (
    <IOScrollView>
      <ObservedPlaylist
        onItemViewed={({ index, item }) => {
          if (!isFocused || !searchId) return
          void logViewItem({
            origin: 'search',
            playlistIndex: 0,
            index: index,
            type: 'venue',
            id: item.objectID,
            playlistId: 'searchResultsVenuePlaylist',
            originId: searchId,
          })
        }}>
        {({ listRef, handleViewableItemsChanged }) => (
          <StyledVenuePlaylist
            venuePlaylistTitle="Les lieux culturels"
            venues={searchResultVenues}
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
