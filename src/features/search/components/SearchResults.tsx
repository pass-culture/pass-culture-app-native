import { plural, t } from '@lingui/macro'
import { useIsFocused } from '@react-navigation/native'
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
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useNetwork } from 'libs/network/useNetwork'
import { SearchHit } from 'libs/search'
import { getSpacing, Spacer } from 'ui/theme'
import { TAB_BAR_COMP_HEIGHT } from 'ui/theme/constants'
import { Helmet } from 'ui/web/global/Helmet'
import { Li } from 'ui/web/list/Li'
import { Ul } from 'ui/web/list/Ul'

const keyExtractor = (item: SearchHit) => item.objectID

const ANIMATION_DURATION = 700

export const SearchResults: React.FC = () => {
  const network = useNetwork()
  const flatListRef = useRef<FlatList<SearchHit> | null>(null)
  const {
    hasNextPage,
    fetchNextPage,
    refetch,
    data,
    hits,
    nbHits,
    isLoading,
    isFetching,
    isFetchingNextPage,
  } = useSearchResults()
  const { searchState } = useSearch()
  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)
  const isFocused = useIsFocused()

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

  const ListHeaderComponent = useMemo(
    () => <NumberOfResults nbHits={nbHits} />,
    [nbHits, searchState.locationFilter.locationType]
  )
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

  const onRefresh = () => {
    if (network.isConnected) {
      refetch()
    }
  }

  if (showSkeleton) return <SearchResultsPlaceHolder />

  const numberOfResults = plural(nbHits, {
    one: '# résultat',
    other: '# résultats',
  })

  const helmetTitle =
    numberOfResults +
    (searchState.query.length > 0 ? ` ${t`pour`} "${searchState.query}"` : '') +
    ' | Recherche | pass Culture'
  return (
    <React.Fragment>
      {isFocused ? <Helmet title={helmetTitle} /> : null}
      <Container>
        <Ul>
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
            CellRendererComponent={Li}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
            scrollEnabled={nbHits > 0}
            ListEmptyComponent={ListEmptyComponent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        </Ul>
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
const Container = styled.View({ flex: 1 })
const Footer = styled.View({ height: TAB_BAR_COMP_HEIGHT + getSpacing(52) })
const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(4),
}))

const FilterContainer = styled.View({
  alignSelf: 'center',
  position: 'absolute',
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(6),
})

const FAVORITE_LIST_PLACEHOLDER = Array.from({ length: 20 }).map((_, index) => ({
  key: index.toString(),
}))

function SearchResultsPlaceHolder() {
  const renderItem = useCallback(() => <HitPlaceholder />, [])
  const ListHeaderComponent = useMemo(() => <NumberOfResultsPlaceholder />, [])
  const ListFooterComponent = useMemo(() => <Footer />, [])

  return (
    <React.Fragment>
      <Container>
        <Ul>
          <FlatList
            data={FAVORITE_LIST_PLACEHOLDER}
            renderItem={renderItem}
            CellRendererComponent={Li}
            contentContainerStyle={contentContainerStyle}
            ListHeaderComponent={ListHeaderComponent}
            ItemSeparatorComponent={Separator}
            ListFooterComponent={ListFooterComponent}
            scrollEnabled={false}
          />
        </Ul>
      </Container>
      <FilterContainer>
        <Filter />
        <Spacer.BottomScreen />
      </FilterContainer>
    </React.Fragment>
  )
}
