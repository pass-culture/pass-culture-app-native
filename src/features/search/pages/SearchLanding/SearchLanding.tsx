import React, { useCallback } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-core'
import AlgoliaSearchInsights from 'search-insights'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { CategoriesList } from 'features/search/components/CategoriesList/CategoriesList'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { SearchSuggestions } from 'features/search/components/SearchSuggestions/SearchSuggestions'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getSearchClient } from 'features/search/helpers/getSearchClient'
import { useSearchHistory } from 'features/search/helpers/useSearchHistory/useSearchHistory'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/LocationWrapper'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { ScreenPerformance } from 'performance/ScreenPerformance'
import { useMeasureScreenPerformanceWhenVisible } from 'performance/useMeasureScreenPerformanceWhenVisible'
import { AIFakeDoorModal } from 'shared/AIFakeDoorModal/AIFakeDoorModal'
import { Form } from 'ui/components/Form'
import { useModal } from 'ui/components/modals/useModal'
import { Page } from 'ui/pages/Page'

const searchInputID = uuidv4()
const suggestionsIndex = env.ALGOLIA_SUGGESTIONS_INDEX_NAME

export const SearchLanding = () => {
  useMeasureScreenPerformanceWhenVisible(ScreenPerformance.SEARCH)

  const netInfo = useNetInfoContext()
  const { isFocusOnSuggestions } = useSearch()
  const { setQueryHistory, queryHistory, addToHistory, removeFromHistory, filteredHistory } =
    useSearchHistory()
  const enableAIFakeDoor = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_AI_FAKE_DOOR)
  const { userLocation } = useLocation()
  const { user } = useAuthContext()
  const { visible, showModal, hideModal } = useModal(false)

  const setQueryHistoryMemoized = useCallback(
    (query: string) => setQueryHistory(query),
    [setQueryHistory]
  )

  if (!netInfo.isConnected) {
    return <OfflinePage />
  }

  return (
    <Page>
      <Form.Flex>
        <InstantSearch
          future={{ preserveSharedStateOnUnmount: true }}
          searchClient={getSearchClient}
          indexName={suggestionsIndex}
          insights={{ insightsClient: AlgoliaSearchInsights }}>
          <Configure hitsPerPage={5} clickAnalytics />

          <Container>
            <SearchHeader
              searchInputID={searchInputID}
              shouldDisplaySubtitle
              addSearchHistory={addToHistory}
              searchInHistory={setQueryHistoryMemoized}
            />
          </Container>

          {isFocusOnSuggestions ? (
            <SearchSuggestions
              queryHistory={queryHistory}
              addToHistory={addToHistory}
              removeFromHistory={removeFromHistory}
              filteredHistory={filteredHistory}
              shouldNavigateToSearchResults
              enableAIFakeDoor={enableAIFakeDoor}
              onPressAIButton={showModal}
            />
          ) : (
            <CategoriesButtonsContainer>
              <CategoriesList
                enableAIFakeDoor={enableAIFakeDoor}
                onPressAIFakeDoorBanner={showModal}
              />
            </CategoriesButtonsContainer>
          )}
        </InstantSearch>
      </Form.Flex>
      {enableAIFakeDoor ? (
        <AIFakeDoorModal
          close={hideModal}
          visible={visible}
          userLocation={userLocation}
          userCity={user?.city}
        />
      ) : null}
    </Page>
  )
}

const CategoriesButtonsContainer = styled.View(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  ...(theme.isMobileViewport ? { marginBottom: theme.tabBar.height } : {}),
}))

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.s,
}))
