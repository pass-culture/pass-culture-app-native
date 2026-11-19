import { FlashList, FlashListRef } from '@shopify/flash-list'
import React, { FC } from 'react'
import { useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { SEARCH_LIST_VIEWABILITY_CONFIG } from 'features/search/constants'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'
import { removeGeolocFromVenue } from 'features/search/helpers/searchList/removeGeolocFromVenue'
import { ListHeaderComponent } from 'features/search/pages/SearchResults/v2/components/SearchLists/components/ListHeaderComponent'
import { ANIMATION_DURATION } from 'features/search/pages/SearchResults/v2/components/SearchLists/searchLists.constants'
import { SearchVenueItemWrapper } from 'features/search/pages/SearchResults/v2/components/SearchListsItems/SearchVenueItemWrapper'
import { VenuesListSkeleton } from 'features/search/pages/SearchResults/v2/components/SearchSkeletons/VenuesListSkeleton'
import { selectSearchVenues } from 'features/search/queries/useSearchVenuesQuery/selectors/selectSearchVenues'
import { useSearchVenuesQuery } from 'features/search/queries/useSearchVenuesQuery/useSearchVenuesQuery'
import { FetchSearchResultsArgs } from 'features/search/types'
import { AlgoliaVenue } from 'libs/algolia/types'
import { asSearchId, asVenueId } from 'libs/analytics/helpers/logViewItem'
import { analytics } from 'libs/analytics/provider'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Ul } from 'ui/components/Ul'

export const VenuesList: FC<{ searchFilters: FetchSearchResultsArgs }> = ({ searchFilters }) => {
  const { data: venuesResponse, isLoading } = useSearchVenuesQuery(searchFilters, {
    select: (data) => selectSearchVenues(data),
  })

  const {
    searchState: { searchId },
  } = useSearch()

  const venues = venuesResponse?.venues || []
  const venueNotOpenToPublic = venuesResponse?.venueNotOpenToPublic
  const searchResultVenues = venueNotOpenToPublic?.[0]
    ? [removeGeolocFromVenue(venueNotOpenToPublic?.[0]), ...venues]
    : venues

  const { width } = useWindowDimensions()
  const { designSystem, breakpoints, tabBar } = useTheme()
  const margin = designSystem.size.spacing.xl
  const gutter = designSystem.size.spacing.l
  const { nbrOfTilesToDisplay } = getGridTileRatio({
    screenWidth: width,
    margin,
    gutter,
    breakpoint: breakpoints.lg,
  })

  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  if (showSkeleton) return <VenuesListSkeleton />

  return (
    <Container>
      <ObservedPlaylist<FlashListRef<AlgoliaVenue>>
        fill
        onItemViewed={({ index, item }) => {
          if (!searchId) return
          void analytics.logViewItem({
            origin: 'search',
            playlistIndex: 0,
            index,
            type: 'venue',
            id: asVenueId(item.objectID),
            playlistId: 'searchResultsVenuePlaylist',
            originId: asSearchId(searchId),
          })
        }}>
        {({ listRef, handleViewableItemsChanged }) => (
          <FlashList
            ref={listRef}
            key="venues_search_results"
            data={searchResultVenues}
            keyExtractor={(item: AlgoliaVenue) => item.objectID}
            ListHeaderComponent={
              <ListHeaderComponent
                title="Les lieux culturels"
                nbItems={searchResultVenues.length}
              />
            }
            renderItem={({ item, index }) => <SearchVenueItemWrapper item={item} index={index} />}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={SEARCH_LIST_VIEWABILITY_CONFIG}
            contentContainerStyle={{
              paddingBottom: tabBar.height + designSystem.size.spacing.xxxl,
              paddingHorizontal: designSystem.size.spacing.xl,
            }}
            numColumns={nbrOfTilesToDisplay}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        )}
      </ObservedPlaylist>
    </Container>
  )
}

const Container = styled(Ul)({
  flex: 1,
})
