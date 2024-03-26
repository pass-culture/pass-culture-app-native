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

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { navigationRef } from 'features/navigation/navigationRef'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { HiddenSuggestionsButton } from 'features/search/components/Buttons/HiddenSuggestionsButton'
import { SearchMainInput } from 'features/search/components/SearchMainInput/SearchMainInput'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getIsVenuePreviousRoute } from 'features/search/helpers/getIsVenuePreviousRoute/getIsVenuePreviousRoute'
import { CreateHistoryItem, SearchState, SearchView } from 'features/search/types'
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
}

const accessibilityDescribedBy = uuidv4()

export const SearchBox: React.FunctionComponent<Props> = ({
  searchInputID,
  accessibleHiddenTitle,
  addSearchHistory,
  searchInHistory,
  ...props
}) => {
  const { isDesktopViewport } = useTheme()
  const { searchState, dispatch, isFocusOnSuggestions, hideSuggestions, showSuggestions } =
    useSearch()
  const { goBack } = useGoBack(...homeNavConfig)
  const [displayedQuery, setDisplayedQuery] = useState<string>(searchState.query)
  const inputRef = useRef<RNTextInput | null>(null)

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
      dispatch({
        type: 'SET_STATE',
        payload: {
          ...searchState,
          ...(options.reset ? initialSearchState : {}),
          ...partialSearchState,
        },
      })
    },
    [dispatch, searchState]
  )

  const hasEditableSearchInput = isFocusOnSuggestions || searchState.view === SearchView.Results

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
    pushWithSearch({ query: '', view: SearchView.Results })
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

    const isVenuePreviousRoute = getIsVenuePreviousRoute(navigationRef.getState().routes)

    switch (true) {
      case isFocusOnSuggestions && searchState.view === SearchView.Results:
        setQuery(searchState.query)
        hideSuggestions()
        break
      case isFocusOnSuggestions && searchState.view === SearchView.Landing:
        setQuery('')
        hideSuggestions()
        break
      case isVenuePreviousRoute:
        dispatch({
          type: 'SET_STATE',
          payload: { ...searchState, view: SearchView.Landing, venue: undefined },
        })
        goBack()
        break
      case searchState.view === SearchView.Results:
        setQuery('')
        dispatch({
          type: 'SET_STATE',
          payload: { ...searchState, view: SearchView.Landing, query: '' },
        })
        break
      default:
        break
    }
  }, [isFocusOnSuggestions, searchState, setQuery, hideSuggestions, dispatch, goBack])

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
        view: SearchView.Results,
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

  const showLocationButton = searchState.view === SearchView.Results && !isFocusOnSuggestions

  const disableInputClearButton =
    searchState.view === SearchView.Results && !isFocusOnSuggestions && !isDesktopViewport

  return (
    <RowContainer>
      {!!accessibleHiddenTitle && (
        <HiddenAccessibleText {...getHeadingAttrs(1)}>{accessibleHiddenTitle}</HiddenAccessibleText>
      )}
      <SearchInputContainer {...props}>
        <SearchInputA11yContainer>
          {!!hasEditableSearchInput && (
            <StyledView>
              <BackButton onGoBack={onPressArrowBack} />
            </StyledView>
          )}
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
