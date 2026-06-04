import { FlashList } from '@shopify/flash-list'
import React, { FC } from 'react'
import { useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

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
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'

export const VenuesList: FC<{ searchFilters: FetchSearchResultsArgs }> = ({ searchFilters }) => {
  const { data: venuesResponse, isLoading } = useSearchVenuesQuery(searchFilters, {
    select: (data) => selectSearchVenues(data),
  })

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
      <FlashList
        key="venues_search_results"
        data={searchResultVenues}
        keyExtractor={(item: AlgoliaVenue) => item.objectID}
        ListHeaderComponent={
          <ListHeaderComponent title="Les lieux culturels" nbItems={searchResultVenues.length} />
        }
        renderItem={({ item, index }) => <SearchVenueItemWrapper item={item} index={index} />}
        contentContainerStyle={{
          paddingBottom: tabBar.height + designSystem.size.spacing.xxxl,
          paddingHorizontal: designSystem.size.spacing.xl,
        }}
        numColumns={nbrOfTilesToDisplay}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
})
