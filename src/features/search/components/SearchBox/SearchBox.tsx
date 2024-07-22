import { useRoute } from '@react-navigation/native'
import debounce from 'lodash/debounce'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch-core'
import {
  Keyboard,
  NativeSyntheticEvent,
  Platform,
  TextInput as RNTextInput,
  TextInputSubmitEditingEventData,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { defaultDisabilitiesProperties } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { HiddenSuggestionsButton } from 'features/search/components/Buttons/HiddenSuggestionsButton'
import { SearchMainInput } from 'features/search/components/SearchMainInput/SearchMainInput'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getIsPreviousRouteFromSearch } from 'features/search/helpers/getIsPreviousRouteFromSearch/getIsPreviousRouteFromSearch'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { CreateHistoryItem, SearchView, SearchState } from 'features/search/types'
import { BackButton } from 'ui/components/headers/BackButton'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const SEARCH_DEBOUNCE_MS = 500

type Props = UseSearchBoxProps & {
  searchInputID: string
  addSearchHistory: (item: CreateHistoryItem) => void
  searchInHistory: (search: string) => void
  accessibleHiddenTitle?: string
  offerCategories?: SearchGroupNameEnumv2[]
  placeholder?: string
}

const accessibilityDescribedBy = uuidv4()

export const SearchBox: React.FunctionComponent<Props> = ({
  searchInputID,
  accessibleHiddenTitle,
  addSearchHistory,
  searchInHistory,
  offerCategories,
  placeholder,
  ...props
}) => {
  const { isDesktopViewport } = useTheme()
  const { searchState, dispatch, isFocusOnSuggestions, hideSuggestions, showSuggestions } =
    useSearch()
  const { goBack } = useGoBack(...homeNavConfig)
  const [displayedQuery, setDisplayedQuery] = useState<string>(searchState.query)
  const inputRef = useRef<RNTextInput | null>(null)
  const route = useRoute()
  const { navigateToSearch: navigateToSearchLanding } = useNavigateToSearch('SearchLanding')
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')

  const currentView = route.name

  // Autocompletion inspired by https://github.com/algolia/doc-code-samples/tree/master/react-instantsearch-hooks-native/getting-started
  const { query: autocompleteQuery, refine: setAutocompleteQuery, clear } = useSearchBox(props)
  // An issue was opened to ask the integration of debounce directly in the lib : https://github.com/algolia/react-instantsearch/discussions/3555
  const debounceSetAutocompleteQuery = useRef(
    debounce(setAutocompleteQuery, SEARCH_DEBOUNCE_MS)
  ).current
  const { data: appSettings } = useSettingsContext()
  const appEnableAutocomplete = appSettings?.appEnableAutocomplete

  const setQuery = useCallback(
    (value: string) => {
      setDisplayedQuery(value)
      if (appEnableAutocomplete) {
        debounceSetAutocompleteQuery(value)
        searchInHistory(value)
      }
    },
    [setDisplayedQuery, appEnableAutocomplete, debounceSetAutocompleteQuery, searchInHistory]
  )
  const pushWithSearch = useCallback(
    (partialSearchState: Partial<SearchState>, options: { reset?: boolean } = {}) => {
      const newSearchState = {
        ...searchState,
        ...(options.reset ? initialSearchState : {}),
        ...partialSearchState,
        offerCategories: offerCategories ?? searchState.offerCategories,
      }
      dispatch({
        type: 'SET_STATE',
        payload: newSearchState,
      })
      navigateToSearchResults(newSearchState, defaultDisabilitiesProperties)
    },
    [dispatch, navigateToSearchResults, offerCategories, searchState]
  )

  const hasEditableSearchInput = isFocusOnSuggestions || currentView === SearchView.Results

  // Track when the InstantSearch query changes to synchronize it with
  // the React state.
  useEffect(() => {
    // We bypass the state update if the input is focused to avoid concurrent
    // updates when typing.
    if (!inputRef.current?.isFocused() && autocompleteQuery !== displayedQuery) {
      setQuery(autocompleteQuery)
    }
    // avoid conflicts when local query state is updating
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autocompleteQuery])

  useEffect(() => {
    // If the user select a value in autocomplete list it must be display in search input
    if (searchState.query !== displayedQuery || searchState.query !== autocompleteQuery) {
      setQuery(searchState.query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState.query])

  const resetQuery = useCallback(() => {
    inputRef.current?.focus()
    clear()
    setQuery('')
    searchInHistory('')
    if (appEnableAutocomplete) {
      showSuggestions()
    } else {
      hideSuggestions()
    }
    pushWithSearch({ query: '' })
  }, [
    clear,
    setQuery,
    searchInHistory,
    appEnableAutocomplete,
    showSuggestions,
    hideSuggestions,
    pushWithSearch,
  ])

  const onPressArrowBack = useCallback(() => {
    // To force remove focus on search input
    Keyboard.dismiss()

    const isVenuePreviousRoute = getIsPreviousRouteFromSearch('Venue')
    const isSearchN1PreviousRoute = getIsPreviousRouteFromSearch('SearchN1')

    switch (true) {
      case isFocusOnSuggestions &&
        (currentView === SearchView.Results || currentView === SearchView.N1):
        setQuery(searchState.query)
        hideSuggestions()
        break
      case isFocusOnSuggestions && currentView === SearchView.Landing:
        setQuery('')
        hideSuggestions()
        break
      case isVenuePreviousRoute:
        dispatch({
          type: 'SET_STATE',
          payload: { ...searchState, venue: undefined },
        })
        goBack()
        break
      case isSearchN1PreviousRoute:
        goBack()
        break
      case currentView === SearchView.Results:
        setQuery('')
        dispatch({
          type: 'SET_STATE',
          payload: { ...initialSearchState, locationFilter: searchState.locationFilter },
        })
        navigateToSearchLanding(
          { ...initialSearchState, locationFilter: searchState.locationFilter },
          defaultDisabilitiesProperties
        )
        break
      default:
        break
    }
  }, [
    isFocusOnSuggestions,
    searchState,
    setQuery,
    hideSuggestions,
    dispatch,
    goBack,
    currentView,
    navigateToSearchLanding,
  ])

  const onSubmitQuery = useCallback(
    (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      const queryText = event.nativeEvent.text
      if (queryText.length < 1 && Platform.OS !== 'android') return
      // When we hit enter, we may have selected a category or a venue on the search landing page
      // these are the two potentially 'staged' filters that we want to commit to the global search state.
      // We also want to commit the price filter, as beneficiary users may have access to different offer
      // price range depending on their available credit.
      addSearchHistory({ query: queryText })
      const searchId = uuidv4()

      const partialSearchState: Partial<SearchState> = {
        query: queryText,
        locationFilter: searchState.locationFilter,
        venue: searchState.venue,
        offerCategories: searchState.offerCategories,
        priceRange: searchState.priceRange,
        searchId,
        isAutocomplete: undefined,
        isFromHistory: undefined,
      }
      pushWithSearch(partialSearchState)
      hideSuggestions()
    },
    [
      addSearchHistory,
      searchState.locationFilter,
      searchState.venue,
      searchState.offerCategories,
      searchState.priceRange,
      pushWithSearch,
      hideSuggestions,
    ]
  )

  const onFocus = useCallback(() => {
    if (isFocusOnSuggestions && appEnableAutocomplete) return
    // Avoid the redirection on suggestions view when user is on a results view
    // (not useful in this case because we don't have suggestions)
    // or suggestions view if it's the current view when feature flag deactivated
    if (hasEditableSearchInput && !appEnableAutocomplete) return
    searchInHistory(searchState.query)
    showSuggestions()
  }, [
    appEnableAutocomplete,
    hasEditableSearchInput,
    isFocusOnSuggestions,
    searchInHistory,
    searchState.query,
    showSuggestions,
  ])

  const showLocationButton =
    currentView === SearchView.Results || (currentView === SearchView.N1 && !isFocusOnSuggestions)

  const disableInputClearButton =
    currentView === SearchView.Results && !isFocusOnSuggestions && !isDesktopViewport

  return (
    <RowContainer>
      {accessibleHiddenTitle ? (
        <HiddenAccessibleText {...getHeadingAttrs(1)}>{accessibleHiddenTitle}</HiddenAccessibleText>
      ) : null}
      <SearchInputContainer {...props}>
        <SearchInputA11yContainer>
          {hasEditableSearchInput ? (
            <StyledView>
              <BackButton onGoBack={onPressArrowBack} />
            </StyledView>
          ) : null}
          <FlexView>
            <HiddenSuggestionsButton />
            <SearchMainInput
              ref={inputRef}
              searchInputID={searchInputID}
              query={displayedQuery}
              setQuery={setQuery}
              isFocusable={isFocusOnSuggestions}
              onSubmitQuery={onSubmitQuery}
              resetQuery={resetQuery}
              onFocus={onFocus}
              showLocationButton={showLocationButton}
              accessibilityDescribedBy={accessibilityDescribedBy}
              disableInputClearButton={disableInputClearButton}
              placeholder={placeholder}
            />
          </FlexView>
        </SearchInputA11yContainer>
      </SearchInputContainer>
      <HiddenAccessibleText nativeID={accessibilityDescribedBy}>
        Indique le nom d’une offre ou d’un lieu puis lance la recherche à l’aide de la touche
        ”Entrée”
      </HiddenAccessibleText>
    </RowContainer>
  )
}

const RowContainer = styled.View({
  flexDirection: 'row',
})

const SearchInputContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
})

const SearchInputA11yContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledView = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: getSpacing(10),
  height: getSpacing(10),
})

const FlexView = styled.View({
  flex: 1,
  flexDirection: 'row',
})
