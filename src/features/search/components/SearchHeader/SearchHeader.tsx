import { useNavigation } from '@react-navigation/native'
import React, { memo } from 'react'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { FilterButton } from 'features/search/components/Buttons/FilterButton/FilterButton'
import { SearchBox } from 'features/search/components/SearchBox/SearchBox'
import { SearchTitleAndWidget } from 'features/search/components/SearchTitleAndWidget/SearchTitleAndWidget'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useFilterCount } from 'features/search/helpers/useFilterCount/useFilterCount'
import { CreateHistoryItem } from 'features/search/types'
import { BackButton } from 'ui/components/headers/BackButton'
import { Spacer } from 'ui/theme'

type Props = {
  searchInputID: string
  addSearchHistory: (item: CreateHistoryItem) => void
  searchInHistory: (search: string) => void
  offerCategories?: SearchGroupNameEnumv2[]
  title?: string
  shouldDisplaySubtitle?: boolean
  withArrow?: boolean
  placeholder?: string
  withFilterButton?: boolean
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
  withFilterButton = false,
}: Props) {
  const { goBack } = useNavigation()
  const { dispatch, searchState } = useSearch()

  const activeFiltersCount = useFilterCount(searchState)

  const onGoBack = () => {
    dispatch({
      type: 'SET_STATE',
      payload: initialSearchState,
    })
    goBack()
  }

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <HeaderContainer>
        <RowContainer>
          {withArrow ? (
            <StyledView>
              <BackButton onGoBack={onGoBack} />
            </StyledView>
          ) : null}
          <SearchTitleAndWidget
            searchInputID={searchInputID}
            shouldDisplaySubtitle={shouldDisplaySubtitle}
            title={title}
          />
        </RowContainer>
        <Container>
          <SearchBoxContainer>
            <SearchBox
              addSearchHistory={addSearchHistory}
              searchInHistory={searchInHistory}
              offerCategories={offerCategories}
              placeholder={placeholder}
            />
          </SearchBoxContainer>
          {withFilterButton ? (
            <FilterButton
              activeFilters={activeFiltersCount}
              navigateTo={{ screen: 'SearchFilter' }}
            />
          ) : null}
        </Container>
      </HeaderContainer>
    </React.Fragment>
  )
})

const HeaderContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
  zIndex: theme.zIndex.header,
  paddingHorizontal: theme.designSystem.size.spacing.xl,
}))

const StyledView = styled.View(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.designSystem.size.spacing.xxxl,
  height: theme.designSystem.size.spacing.xxxl,
}))

const RowContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: theme.designSystem.size.spacing.l,
}))

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'flex-end',
  gap: theme.designSystem.size.spacing.s,
  width: '100%',
}))

const SearchBoxContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
})
