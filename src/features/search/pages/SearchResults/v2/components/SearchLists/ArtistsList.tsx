import { FlashList } from '@shopify/flash-list'
import React, { FC } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ListHeaderComponent } from 'features/search/pages/SearchResults/v2/components/SearchLists/components/ListHeaderComponent'
import { ANIMATION_DURATION } from 'features/search/pages/SearchResults/v2/components/SearchLists/searchLists.constants'
import { SearchArtistItemWrapper } from 'features/search/pages/SearchResults/v2/components/SearchListsItems/SearchArtistItemWrapper'
import { ArtistsListSkeleton } from 'features/search/pages/SearchResults/v2/components/SearchSkeletons/ArtistsListSkeleton'
import { selectSearchArtists } from 'features/search/queries/useSearchArtists/selectors/selectSearchArtists'
import { useSearchArtistsQuery } from 'features/search/queries/useSearchArtists/useSearchArtistsQuery'
import { FetchSearchResultsArgs } from 'features/search/types'
import { Artist } from 'features/venue/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'

export const ArtistsList: FC<{ searchFilters: FetchSearchResultsArgs }> = ({ searchFilters }) => {
  const { data: artistsResponse = [], isLoading } = useSearchArtistsQuery(searchFilters, {
    select: (data) => selectSearchArtists(data),
  })

  const { designSystem, tabBar } = useTheme()

  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  if (showSkeleton) return <ArtistsListSkeleton />

  return (
    <Container>
      <FlashList
        key="artists_search_results"
        data={artistsResponse}
        keyExtractor={(item: Artist) => item.id}
        ListHeaderComponent={
          <ListHeaderComponent title="Les artistes" nbItems={artistsResponse.length} />
        }
        ItemSeparatorComponent={LineSeparator}
        renderItem={({ item }) => <SearchArtistItemWrapper item={item} />}
        contentContainerStyle={{
          paddingBottom: tabBar.height + designSystem.size.spacing.xxxl,
          paddingHorizontal: designSystem.size.spacing.xl,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
})

const LineSeparator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.designSystem.color.background.subtle,
  marginVertical: theme.designSystem.size.spacing.l,
}))
