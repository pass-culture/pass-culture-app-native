import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useId } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import { Keyboard } from 'react-native'
import AlgoliaSearchInsights from 'search-insights'
import styled from 'styled-components/native'

import { CategoriesList } from 'features/search/components/CategoriesList/CategoriesList'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { SearchSuggestionsAnnouncer } from 'features/search/components/SearchSuggestionsStatus/SearchSuggestionsAnnouncer'
import { SEARCH_CATEGORIES_ANCHOR_ID } from 'features/search/constants'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchClient } from 'features/search/helpers/getSearchClient'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { ScreenPerformance } from 'performance/ScreenPerformance'
import { useMeasureScreenPerformanceWhenVisible } from 'performance/useMeasureScreenPerformanceWhenVisible'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { useIsLandscape } from 'shared/useIsLandscape/useIsLandscape'
import { Form } from 'ui/components/Form'
import { Page } from 'ui/pages/Page'

const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

export const SearchLanding = () => {
  const suggestionsDescriptionId = useId()
  useMeasureScreenPerformanceWhenVisible(ScreenPerformance.SEARCH)

  const netInfo = useNetInfoContext()
  const { isFocusOnSuggestions, dispatch, searchState } = useSearch()

  const resetSearchFiltersOnLanding = () => {
    dispatch({
      type: 'SET_STATE',
      payload: {
        ...initialSearchState,
        locationFilter: searchState.locationFilter,
      },
    })
  }

  useFocusEffect(resetSearchFiltersOnLanding)

  const { setQueryHistory, queryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()
  const enableNewCategoryBlocks = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_CATEGORY_BLOCKS)

  const isZoomedAt200 = useMobileFontScaleToDisplay({ default: false, at200PercentZoom: true })
  const isLandscape = useIsLandscape()
  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  const searchHeader = (
    <Container>
      <SearchHeader
        suggestionsDescriptionId={suggestionsDescriptionId}
        shouldDisplaySubtitle
        addSearchHistory={addToHistory}
        searchInHistory={setQueryHistoryMemoized}
        quickAccess={{
          targetId: SEARCH_CATEGORIES_ANCHOR_ID,
          title: 'Aller aux catégories',
        }}
      />
    </Container>
  )
  const scrollHeader = isZoomedAt200 || isLandscape
  const body = isFocusOnSuggestions ? (
    <SearchSuggestions
      suggestionsDescriptionId={suggestionsDescriptionId}
      queryHistory={queryHistory}
      addToHistory={addToHistory}
      removeFromHistory={removeFromHistory}
      filteredHistory={filteredHistory}
      shouldNavigateToSearchResults
      embedded={scrollHeader}
    />
  ) : (
    <CategoriesButtonsContainer>
      <CategoriesList enableNewCategoryBlocks={enableNewCategoryBlocks} />
    </CategoriesButtonsContainer>
  )

  return (
    <Page>
      <Form.Flex>
        <InstantSearch
          future={{ preserveSharedStateOnUnmount: true }}
          searchClient={getSearchClient}
          indexName={suggestionsIndex}
          insights={{ insightsClient: AlgoliaSearchInsights }}>
          <Configure hitsPerPage={5} clickAnalytics analytics />

          {scrollHeader ? (
            <LandingScrollView
              keyboardShouldPersistTaps="handled"
              onScroll={isFocusOnSuggestions ? Keyboard.dismiss : undefined}
              scrollEventThrottle={16}>
              {searchHeader}
              {body}
            </LandingScrollView>
          ) : (
            <React.Fragment>
              {searchHeader}
              {body}
            </React.Fragment>
          )}
          <SearchSuggestionsAnnouncer
            id={suggestionsDescriptionId}
            query={queryHistory}
            visible={isFocusOnSuggestions}
          />
        </InstantSearch>
      </Form.Flex>
    </Page>
  )
}

const CategoriesButtonsContainer = styled.View(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  ...(theme.isMobileViewport ? { marginBottom: theme.tabBar.height } : {}),
}))

const LandingScrollView = styled.ScrollView(({ theme }) => ({
  flex: 1,
  ...(theme.isMobileViewport ? { marginBottom: theme.tabBar.height } : {}),
}))

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.s,
}))
