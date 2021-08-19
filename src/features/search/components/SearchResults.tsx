import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { FlatList, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

import { Hit, NoSearchResult, NumberOfResults } from 'features/search/atoms'
import { Filter } from 'features/search/atoms/Buttons'
import { HitPlaceholder, NumberOfResultsPlaceholder } from 'features/search/components/Placeholders'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { useSearchResults } from 'features/search/pages/useSearchResults'
import { analytics } from 'libs/analytics'
import { SearchHit } from 'libs/search'
import { ColorsEnum, getSpacing, Spacer, TAB_BAR_COMP_HEIGHT } from 'ui/theme'

const keyExtractor = (item: SearchHit) => item.objectID

export const SearchResults: React.FC = () => {
  const flatListRef = useRef<FlatList<SearchHit> | null>(null)
  const { hasNextPage, fetchNextPage, data, hits, nbHits, isLoading, isFetchingNextPage } =
    useSearchResults()
  const { searchState } = useSearch()

  useEffect(
    // Despite the fact that the useEffect hook being called immediately,
    // scrollToOffset may not always have an effect for unknown reason,
    // debouncing scrollToOffset solves it.
    debounce(
      useCallback(() => {
        if (flatListRef && flatListRef.current) {
          flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
        }
      }, [flatListRef])
    ),
    [nbHits, searchState]
  )

  const onEndReached = useCallback(() => {
    if (data && hasNextPage) {
      const [lastPage] = data.pages.slice(-1)
      if (lastPage.page > 0) analytics.logSearchScrollToPage(lastPage.page)
      fetchNextPage()
    }
  }, [hasNextPage])

  const renderItem = useCallback(
    ({ item: hit }: { item: SearchHit }) => <Hit hit={hit} query={searchState.query} />,
    [searchState.query]
  )

  const ListHeaderComponent = useMemo(() => <NumberOfResults nbHits={nbHits} />, [nbHits])
  const ListEmptyComponent = useMemo(() => <NoSearchResult />, [])
  const ListFooterComponent = useMemo(
    () =>
      isFetchingNextPage && hits.length < nbHits ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <ActivityIndicator />
          <Spacer.Column numberOfSpaces={4} />
          <Footer />
        </React.Fragment>
      ) : (
        <Footer />
      ),
    [isFetchingNextPage, hits.length]
  )

  if (isLoading || !data) return <SearchResultsPlaceHolder />
  return (
    <React.Fragment>
      <Container>
        <FlatList
          ref={flatListRef}
          testID="searchResultsFlatlist"
          data={hits}
          contentContainerStyle={contentContainerStyle}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={Separator}
          ListFooterComponent={ListFooterComponent}
          renderItem={renderItem}
          onEndReached={onEndReached}
          scrollEnabled={nbHits > 0}
          ListEmptyComponent={ListEmptyComponent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </Container>
      {nbHits > 0 && (
        <FilterContainer>
          <Filter />
          <Spacer.BottomScreen />
        </FilterContainer>
      )}
    </React.Fragment>
  )
}

const contentContainerStyle = { flexGrow: 1 }
const Container = styled.View({ height: '100%' })
const Footer = styled.View({ height: TAB_BAR_COMP_HEIGHT + getSpacing(52) })
const Separator = styled.View({
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(4),
})

const FilterContainer = styled.View({
  alignSelf: 'center',
  position: 'absolute',
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(6),
})

const FAVORITE_LIST_PLACEHOLDER = Array.from({ length: 20 }).map((_, index) => ({
  key: index.toString(),
}))

const SearchResultsPlaceHolder = () => {
  const renderItem = useCallback(() => <HitPlaceholder />, [])
  const ListHeaderComponent = useMemo(() => <NumberOfResultsPlaceholder />, [])
  const ListFooterComponent = useMemo(() => <Footer />, [])

  return (
    <React.Fragment>
      <Container>
        <FlatList
          data={FAVORITE_LIST_PLACEHOLDER}
          renderItem={renderItem}
          contentContainerStyle={contentContainerStyle}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={Separator}
          ListFooterComponent={ListFooterComponent}
          scrollEnabled={false}
        />
      </Container>
      <FilterContainer>
        <Filter />
        <Spacer.BottomScreen />
      </FilterContainer>
    </React.Fragment>
  )
}
