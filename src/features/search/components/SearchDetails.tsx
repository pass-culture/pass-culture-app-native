import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useRef, useState } from 'react'
import { NativeSyntheticEvent, TextInput, TextInputSubmitEditingEventData } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchResults } from 'features/search/components/SearchResults'
import { useShowResults } from 'features/search/pages/Search'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { analytics } from 'libs/analytics'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Clock } from 'ui/svg/icons/Clock'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { getSpacing, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const SearchDetails: React.FC = () => {
  const { top } = useCustomSafeInsets()
  const [query, _setQuery] = useState<string>('')
  const { searchState } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()
  const refSearchInput = useRef<TextInput | null>(null)
  const showResults = useShowResults()
  const { searchState: stagedSearchState, dispatch: stagedDispatch } = useStagedSearch()

  useFocusEffect(
    useCallback(() => {
      setQuery(searchState.query)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchState.query])
  )

  function setQuery(value: string) {
    stagedDispatch({ type: 'SET_QUERY', payload: value })
    _setQuery(value)
  }

  const resetSearchInput = () => {
    navigate(...getTabNavConfig('Search', { query: '' }))
    setQuery('')
  }

  const onSubmitQuery = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    // When we hit enter, we may have selected a category or a venue on the search landing page
    // these are the two potentially 'staged' filters that we want to commit to the global search state.
    // We also want to commit the price filter, as beneficiary users may have access to different offer
    // price range depending on their available credit.
    const { locationFilter, offerCategories, priceRange } = stagedSearchState
    navigate(
      ...getTabNavConfig('Search', {
        showResults: true,
        query: event.nativeEvent.text,
        locationFilter,
        offerCategories,
        priceRange,
      })
    )
    analytics.logSearchQuery(event.nativeEvent.text)
  }

  return (
    <React.Fragment>
      <HeaderBackgroundWrapper maxHeight={top}>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      <SearchInputContainer>
        <TouchableOpacity
          testID="previousBtn"
          onPress={() => navigate(...getTabNavConfig('Search'))}>
          <ArrowPrevious />
        </TouchableOpacity>
        <StyledSearchInputContainer>
          <StyledSearchInput
            value={query}
            onChangeText={setQuery}
            placeholder={t`Offre, artiste...`}
            autoFocus={true}
            inputHeight="regular"
            LeftIcon={() => <MagnifyingGlassIcon />}
            onSubmitEditing={onSubmitQuery}
            onPressRightIcon={resetSearchInput}
            ref={refSearchInput}
          />
        </StyledSearchInputContainer>
      </SearchInputContainer>

      {showResults ? (
        <SearchResults />
      ) : (
        <RecentSearchContainer>
          <ClockIcon />
          <StyledCaption>{t`Recherche récente`}</StyledCaption>
        </RecentSearchContainer>
      )}
    </React.Fragment>
  )
}

const SearchInputContainer = styled.View({
  paddingTop: getSpacing(4),
  paddingHorizontal: getSpacing(6),
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledSearchInputContainer = styled.View({
  flexDirection: 'row',
  flexGrow: 1,
  marginHorizontal: getSpacing(4),
})

const RecentSearchContainer = styled.View(({ theme }) => ({
  marginTop: getSpacing(4),
  backgroundColor: theme.colors.greyLight,
  paddingHorizontal: getSpacing(6),
  minHeight: getSpacing(9),
  flexDirection: 'row',
  alignItems: 'center',
}))

const ClockIcon = styled(Clock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const MagnifyingGlassIcon = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const StyledCaption = styled(Typo.Caption)({
  marginLeft: getSpacing(3),
})

const StyledSearchInput = styled(SearchInput).attrs(({ theme }) => ({
  focusOutlineColor: theme.colors.black,
}))({
  paddingHorizontal: getSpacing(4),
})

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const HeaderBackgroundWrapper = styled.View<{ maxHeight: number }>(({ maxHeight }) => ({
  overflow: 'hidden',
  position: 'relative',
  maxHeight,
}))
