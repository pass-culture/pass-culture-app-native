import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch-hooks'
import { NativeSyntheticEvent, Platform, TextInputSubmitEditingEventData } from 'react-native'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { LocationType } from 'features/search/enums'
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

type Props = UseSearchBoxProps & {
  searchInputID: string
  showLocationButton?: boolean
  onFocusState?: (focus: boolean) => void
  isFocus?: boolean
  accessibleHiddenTitle?: string
}

const SEARCH_DEBOUNCE_MS = 500

export const SearchBoxRework: React.FC<Props> = ({
  searchInputID,
  showLocationButton,
  onFocusState,
  isFocus,
  accessibleHiddenTitle,
  ...props
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState: stagedSearchState } = useStagedSearch()
  const { searchState, dispatch } = useSearch()
  const accessibilityDescribedBy = uuidv4()
  const showResults = useShowResults()
  const { locationFilter } = stagedSearchState
  const { locationType } = locationFilter
  // PLACE and VENUE belong to the same section
  const section = locationType === LocationType.VENUE ? LocationType.PLACE : locationType
  const { label: locationLabel } = useLocationChoice(section)
  const inputRef = useRef<RNTextInput | null>(null)
  const { query, refine } = useSearchBox(props)
  const [value, setValue] = useState<string>(query)
  const [debouncedValue, setDebouncedValue] = useState<string>(value)
  const debouncedSetValue = useRef(debounce(setDebouncedValue, SEARCH_DEBOUNCE_MS)).current

  // Track when the value coming from the React state changes to synchronize
  // it with InstantSearch.
  useEffect(() => {
    if (query !== debouncedValue) {
      refine(debouncedValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, refine])

  // Track when the InstantSearch query changes to synchronize it with
  // the React state.
  useEffect(() => {
    // We bypass the state update if the input is focused to avoid concurrent
    // updates when typing.
    if (!inputRef.current?.isFocused() && query !== debouncedValue && searchState.query === '') {
      setValue(query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const resetSearch = () => {
    navigate(...getTabNavConfig('Search', { query: '' }))
    setValue('')
  }

  const onPressArrowBack = () => {
    setValue('')
    if (onFocusState) onFocusState(false)
    dispatch({ type: 'SET_QUERY', payload: '' })
    dispatch({ type: 'SHOW_RESULTS', payload: false })
    dispatch({ type: 'INIT' })
  }

  const onPressLocationButton = useCallback(() => {
    navigate('LocationFilter')
  }, [navigate])

  const onSubmitQuery = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const queryText = event.nativeEvent.text
    if (queryText.length < 1 && Platform.OS !== 'android') return
    // When we hit enter, we may have selected a category or a venue on the search landing page
    // these are the two potentially 'staged' filters that we want to commit to the global search state.
    // We also want to commit the price filter, as beneficiary users may have access to different offer
    // price range depending on their available credit.
    const { offerCategories, priceRange } = stagedSearchState
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

  const onChangeText = (value: string) => {
    setValue(value)
    debouncedSetValue(value)
  }

  return (
    <React.Fragment>
      {!!accessibleHiddenTitle && (
        <HiddenAccessibleText {...getHeadingAttrs(1)}>{accessibleHiddenTitle}</HiddenAccessibleText>
      )}
      <SearchInputContainer marginHorizontal={showResults || isFocus ? getSpacing(6) : 0}>
        {showResults || isFocus ? (
          <StyledTouchableOpacity testID="previousButton" onPress={onPressArrowBack}>
            <ArrowPrevious />
          </StyledTouchableOpacity>
        ) : null}
        <StyledSearchInput
          searchInputID={searchInputID}
          value={value}
          onChangeText={onChangeText}
          placeholder={t`Offre, artiste...`}
          autoFocus={isFocus}
          inputHeight="regular"
          LeftIcon={() => <MagnifyingGlassIcon />}
          onSubmitEditing={onSubmitQuery}
          onPressRightIcon={resetSearch}
          onFocusState={onFocusState}
          testID="searchInput"
          onPressLocationButton={showLocationButton ? onPressLocationButton : undefined}
          locationLabel={locationLabel}
          ref={inputRef}
        />
      </SearchInputContainer>
      <HiddenAccessibleText nativeID={accessibilityDescribedBy}>
        {t`Indique le nom d'une offre ou d'un lieu puis lance la recherche à l'aide de la touche
          "Entrée"`}
      </HiddenAccessibleText>
    </React.Fragment>
  )
}

const StyledSearchInput = styled((props) => <SearchInput {...props} />)({
  outlineOffset: 0,
})

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const MagnifyingGlass = styled(DefaultMagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const MagnifyingGlassIcon = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const SearchInputContainer = styled.View<{ marginHorizontal: number }>(({ marginHorizontal }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal,
}))

const StyledTouchableOpacity = styled(TouchableOpacity)({
  marginRight: getSpacing(4),
})
