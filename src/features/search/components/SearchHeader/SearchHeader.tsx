import { useNavigation } from '@react-navigation/native'
import React, { memo } from 'react'
// import { View } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { SearchBox } from 'features/search/components/SearchBox/SearchBox'
import { SearchTitleAndWidget } from 'features/search/components/SearchTitleAndWidget/SearchTitleAndWidget'
import { CreateHistoryItem } from 'features/search/types'
import { BackButton } from 'ui/components/headers/BackButton'
import { getSpacing, Spacer } from 'ui/theme'
// import { ScanRoundedButton } from 'features/scan/ScanRoundedButton'

type Props = {
  searchInputID: string
  addSearchHistory: (item: CreateHistoryItem) => void
  searchInHistory: (search: string) => void
  offerCategories?: SearchGroupNameEnumv2[]
  title?: string
  shouldDisplaySubtitle?: boolean
  withArrow?: boolean
  placeholder?: string
}

export const SearchHeader = memo(function SearchHeader({
  searchInputID,
  addSearchHistory,
  searchInHistory,
  shouldDisplaySubtitle = false,
  withArrow = false,
  title = 'Rechercher',
  offerCategories,
  placeholder,
}: Props) {
  const { goBack } = useNavigation()

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <HeaderContainer>
        <RowContainer>
          {withArrow ? (
            <StyledView>
              <BackButton onGoBack={goBack} />
            </StyledView>
          ) : null}
          <SearchTitleAndWidget
            searchInputID={searchInputID}
            shouldDisplaySubtitle={shouldDisplaySubtitle}
            title={title}
          />
        </RowContainer>
        <Spacer.Column numberOfSpaces={4} />
        <RowContainer>
          <SearchBox
            searchInputID={searchInputID}
            addSearchHistory={addSearchHistory}
            searchInHistory={searchInHistory}
            offerCategories={offerCategories}
            placeholder={placeholder}
          />
          {/* <ScanRoundedButton /> */}
        </RowContainer>
      </HeaderContainer>
    </React.Fragment>
  )
})

const HeaderContainer = styled.View(({ theme }) => ({
  marginTop: getSpacing(6),
  zIndex: theme.zIndex.header,
  paddingHorizontal: getSpacing(6),
}))

const StyledView = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: getSpacing(10),
  height: getSpacing(10),
})

const RowContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
