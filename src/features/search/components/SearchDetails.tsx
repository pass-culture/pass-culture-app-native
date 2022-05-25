import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { TextInput } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchResults } from 'features/search/components/SearchResults'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useShowResults } from 'features/search/pages/useShowResults'
import { analytics } from 'libs/analytics'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Touchable } from 'ui/components/touchable/Touchable'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Clock } from 'ui/svg/icons/Clock'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { getSpacing, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const SearchDetails: React.FC = () => {
  const { top } = useCustomSafeInsets()
  const { navigate } = useNavigation<UseNavigationType>()
  const refSearchInput = useRef<TextInput | null>(null)
  const showResults = useShowResults()
  const { searchState: stagedSearchState } = useStagedSearch()
  const { searchState } = useSearch()
  const [query, setQuery] = useState<string>(searchState.query || '')

  const resetSearchInput = () => {
    navigate(...getTabNavConfig('Search', { query: '' }))
    setQuery('')
  }

  const onSubmitQuery = () => {
    // When we hit enter, we may have selected a category or a venue on the search landing page
    // these are the two potentially 'staged' filters that we want to commit to the global search state.
    // We also want to commit the price filter, as beneficiary users may have access to different offer
    // price range depending on their available credit.
    const { locationFilter, offerCategories, priceRange } = stagedSearchState

    navigate(
      ...getTabNavConfig('Search', {
        showResults: true,
        query,
        locationFilter,
        offerCategories,
        priceRange,
      })
    )
    analytics.logSearchQuery(query)
  }

  return (
    <React.Fragment>
      <HeaderBackgroundWrapper maxHeight={top}>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      <SearchInputContainer>
        <Touchable
          accessibilityLabel={t`Revenir en arrière`}
          testID="previousBtn"
          onPress={() => navigate(...getTabNavConfig('Search'))}>
          <ArrowPrevious />
        </Touchable>
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
