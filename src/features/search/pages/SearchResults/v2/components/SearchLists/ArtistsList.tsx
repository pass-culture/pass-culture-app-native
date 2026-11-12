import { FlashList, FlashListRef } from '@shopify/flash-list'
import React, { FC } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { SEARCH_LIST_VIEWABILITY_CONFIG } from 'features/search/constants'
import { useSearch } from 'features/search/context/SearchWrapper'
import { ListHeaderComponent } from 'features/search/pages/SearchResults/v2/components/SearchLists/components/ListHeaderComponent'
import { ANIMATION_DURATION } from 'features/search/pages/SearchResults/v2/components/SearchLists/searchLists.constants'
import { SearchArtistItemWrapper } from 'features/search/pages/SearchResults/v2/components/SearchListsItems/SearchArtistItemWrapper'
import { ArtistsListSkeleton } from 'features/search/pages/SearchResults/v2/components/SearchSkeletons/ArtistsListSkeleton'
import { selectSearchArtists } from 'features/search/queries/useSearchArtists/selectors/selectSearchArtists'
import { useSearchArtistsQuery } from 'features/search/queries/useSearchArtists/useSearchArtistsQuery'
import { FetchSearchResultsArgs } from 'features/search/types'
import { Artist } from 'features/venue/types'
import { asArtistId, asSearchId } from 'libs/analytics/helpers/logViewItem'
import { analytics } from 'libs/analytics/provider'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Ul } from 'ui/components/Ul'

export const ArtistsList: FC<{ searchFilters: FetchSearchResultsArgs }> = ({ searchFilters }) => {
  const { data: artistsResponse = [], isLoading } = useSearchArtistsQuery(searchFilters, {
    select: (data) => selectSearchArtists(data),
  })
  const {
    searchState: { searchId },
  } = useSearch()

  const { designSystem, tabBar } = useTheme()

  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  if (showSkeleton) return <ArtistsListSkeleton />

  return (
    <Container>
      <ObservedPlaylist<FlashListRef<Artist>>
        fill
        onItemViewed={({ index, item }) => {
          if (!searchId) return
          void analytics.logViewItem({
            origin: 'search',
            playlistIndex: 0,
            index,
            type: 'artist',
            id: asArtistId(item.id),
            playlistId: 'searchResultsArtistPlaylist',
            originId: asSearchId(searchId),
          })
        }}>
        {({ listRef, handleViewableItemsChanged }) => (
          <FlashList
            ref={listRef}
            key="artists_search_results"
            data={artistsResponse}
            keyExtractor={(item: Artist) => item.id}
            ListHeaderComponent={
              <ListHeaderComponent title="Les artistes" nbItems={artistsResponse.length} />
            }
            ItemSeparatorComponent={LineSeparator}
            renderItem={({ item }) => <SearchArtistItemWrapper item={item} />}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={SEARCH_LIST_VIEWABILITY_CONFIG}
            contentContainerStyle={{
              paddingBottom: tabBar.height + designSystem.size.spacing.xxxl,
              paddingHorizontal: designSystem.size.spacing.xl,
            }}
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

const LineSeparator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.designSystem.color.background.subtle,
  marginVertical: theme.designSystem.size.spacing.l,
}))
