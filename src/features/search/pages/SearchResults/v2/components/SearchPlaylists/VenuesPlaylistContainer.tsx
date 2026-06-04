import { useIsFocused } from '@react-navigation/native'
import React, { FC } from 'react'
import { ViewToken } from 'react-native'
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
import { useLocation } from 'libs/location/location'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { usePageTracking } from 'shared/tracking/usePageTracking'

type Props = {
  withMargins: boolean
  searchFilters: FetchSearchResultsArgs
}
export const VenuesPlaylistContainer: FC<Props> = ({ withMargins, searchFilters }) => {
  const isFocused = useIsFocused()

  const { selectedLocationMode } = useLocation()
  const isLocated = selectedLocationMode !== LocationMode.EVERYWHERE
  const { searchState } = useSearch()

  const { data: venuesResponse } = useSearchVenuesQuery(searchFilters, {
    select: (venuesResponse) => selectSearchVenues(venuesResponse),
  })

  const hasSelectedSearchFilters = hasActiveSearchFilters(searchFilters)

  const venues = venuesResponse?.venues || []
  const venueNotOpenToPublic = venuesResponse?.venueNotOpenToPublic
  const searchResultVenues = venueNotOpenToPublic?.[0]
    ? [removeGeolocFromVenue(venueNotOpenToPublic?.[0]), ...venues]
    : venues

  const pageTracking = usePageTracking({
    pageName: 'SearchResults',
    pageLocation: 'searchresults',
  })

  // Handler for modules with the new system
  const handleViewableItemsChanged = (items, moduleId, itemType, playlistIndex) => {
    pageTracking.trackViewableItems({
      moduleId,
      itemType,
      viewableItems: items,
      searchId: searchState.searchId,
      playlistIndex,
    })
  }

  const handleVenuePlaylistViewableItemsChanged = (items: Pick<ViewToken, 'key' | 'index'>[]) => {
    if (!isFocused) return
    handleViewableItemsChanged?.(items, 'searchResultsVenuePlaylist', 'venue', 0)
  }

  if (!searchResultVenues.length || hasSelectedSearchFilters) return null

  return (
    <IOScrollView>
      <ObservedPlaylist onViewableItemsChanged={handleVenuePlaylistViewableItemsChanged}>
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
