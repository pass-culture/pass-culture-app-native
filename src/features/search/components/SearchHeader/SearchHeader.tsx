import React, { memo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SearchBox } from 'features/search/components/SearchBox/SearchBox'
import { SearchTitleAndWidget } from 'features/search/components/SearchTitleAndWidget/SearchTitleAndWidget'
import { CreateHistoryItem, SearchView } from 'features/search/types'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  searchInputID: string
  addSearchHistory: (item: CreateHistoryItem) => void
  searchInHistory: (search: string) => void
  searchView: SearchView
}

export const SearchHeader = memo(function SearchHeader({
  searchInputID,
  searchView,
  addSearchHistory,
  searchInHistory,
}: Props) {
  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <HeaderContainer>
        <SearchTitleAndWidget
          searchInputID={searchInputID}
          shouldDisplaySubtitle={searchView === SearchView.Landing}
        />
        <Spacer.Column numberOfSpaces={4} />
        <View>
          <SearchBox
            searchInputID={searchInputID}
            addSearchHistory={addSearchHistory}
            searchInHistory={searchInHistory}
          />
        </View>
      </HeaderContainer>
    </React.Fragment>
  )
})

const HeaderContainer = styled.View(({ theme }) => ({
  marginTop: getSpacing(6),
  zIndex: theme.zIndex.header,
  paddingHorizontal: getSpacing(6),
}))
