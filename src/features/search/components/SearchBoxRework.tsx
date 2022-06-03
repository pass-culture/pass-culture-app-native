import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { NativeSyntheticEvent, Platform, TextInputSubmitEditingEventData } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useShowResults } from 'features/search/pages/useShowResults'
import { analytics } from 'libs/analytics'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { MagnifyingGlass as DefaultMagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  searchInputID: string
  showLocationButton?: boolean
  onFocusState?: (focus: boolean) => void
  isFocus?: boolean
  accessibleHiddenTitle?: string
}

export const SearchBoxRework: React.FC<Props> = ({
  searchInputID,
  showLocationButton,
  onFocusState,
  isFocus,
  accessibleHiddenTitle,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState: stagedSearchState } = useStagedSearch()
  const { searchState, dispatch } = useSearch()
  const [query, setQuery] = useState<string>(searchState.query || '')
  const accessibilityDescribedBy = uuidv4()
  const showResults = useShowResults()

  const resetSearch = () => {
    navigate(...getTabNavConfig('Search', { query: '' }))
    setQuery('')
  }

  const onPressArrowBack = () => {
    setQuery('')
    if (onFocusState) onFocusState(false)
    dispatch({ type: 'SET_QUERY', payload: '' })
    dispatch({ type: 'SHOW_RESULTS', payload: false })
    dispatch({ type: 'INIT' })
  }

  const onSubmitQuery = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const queryText = event.nativeEvent.text
    if (queryText.length < 1 && Platform.OS !== 'android') return
    // When we hit enter, we may have selected a category or a venue on the search landing page
    // these are the two potentially 'staged' filters that we want to commit to the global search state.
    // We also want to commit the price filter, as beneficiary users may have access to different offer
    // price range depending on their available credit.
    const { locationFilter, offerCategories, priceRange } = stagedSearchState
    navigate(
      ...getTabNavConfig('Search', {
        showResults: true,
        query: queryText,
        locationFilter,
        offerCategories,
        priceRange,
      })
    )
    analytics.logSearchQuery(queryText)
  }

  return (
    <React.Fragment>
      {!!accessibleHiddenTitle && (
        <HiddenAccessibleText {...getHeadingAttrs(1)}>{accessibleHiddenTitle}</HiddenAccessibleText>
      )}
      <SearchInputContainer marginRight={showResults || isFocus ? getSpacing(4) : 0}>
        {showResults || isFocus ? (
          <StyledTouchableOpacity testID="previousButton" onPress={onPressArrowBack}>
            <ArrowPrevious />
          </StyledTouchableOpacity>
        ) : null}
        <StyledSearchInput
          searchInputID={searchInputID}
          value={query}
          onChangeText={setQuery}
          placeholder={t`Offre, artiste...`}
          autoFocus={isFocus}
          inputHeight="regular"
          LeftIcon={() => <MagnifyingGlassIcon />}
          onSubmitEditing={onSubmitQuery}
          onPressRightIcon={resetSearch}
          onFocusState={onFocusState}
          testID="searchInput"
          showLocationButton={showLocationButton}
        />
      </SearchInputContainer>
      <HiddenAccessibleText nativeID={accessibilityDescribedBy}>
        {t`Indique le nom d'une offre ou d'un lieu puis lance la recherche à l'aide de la touche
          "Entrée"`}
      </HiddenAccessibleText>
    </React.Fragment>
  )
}

const StyledSearchInput = styled((props) => <SearchInput {...props} />).attrs(({ theme }) => ({
  focusOutlineColor: theme.colors.black,
}))({
  outlineOffset: 0,
})

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const MagnifyingGlass = styled(DefaultMagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const MagnifyingGlassIcon = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const SearchInputContainer = styled.View<{ marginRight: number }>(({ marginRight }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight,
}))

const StyledTouchableOpacity = styled(TouchableOpacity)({
  marginHorizontal: getSpacing(4),
})
