import React from 'react'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { AutocompleteOffer } from 'features/search/components/AutocompleteOffer/AutocompleteOffer'
import { CreateHistoryItem, HistoryItem } from 'features/search/types'
import { getSpacing } from 'ui/theme'

type SearchSuggestionsParams = {
  queryHistory: string
  addToHistory: (item: CreateHistoryItem) => Promise<void>
  removeFromHistory: (item: HistoryItem) => Promise<void>
  filteredHistory: HistoryItem[]
  shouldNavigateToSearchResults?: boolean
  offerCategories?: SearchGroupNameEnumv2[]
}
export const SearchSuggestions = ({ addToHistory, offerCategories }: SearchSuggestionsParams) => {
  return (
    <StyledScrollView
      testID="autocompleteScrollView"
      keyboardShouldPersistTaps="handled"
      onScroll={Keyboard.dismiss}
      scrollEventThrottle={16}>
      <AutocompleteOffer addSearchHistory={addToHistory} offerCategories={offerCategories} />
    </StyledScrollView>
  )
}

const StyledScrollView = styled.ScrollView(({ theme }) => ({
  paddingTop: getSpacing(4),
  paddingBottom: getSpacing(3),
  flex: 1,
  paddingLeft: getSpacing(6),
  paddingRight: getSpacing(6),
  ...(theme.isMobileViewport ? { marginBottom: theme.tabBar.height } : {}),
}))
