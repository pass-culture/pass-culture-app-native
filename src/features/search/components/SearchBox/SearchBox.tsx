import { useRoute } from '@react-navigation/native'
import { debounce } from 'lodash'
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
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { HiddenSuggestionsButton } from 'features/search/components/Buttons/HiddenSuggestionsButton'
import { SearchMainInput } from 'features/search/components/SearchMainInput/SearchMainInput'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { CreateHistoryItem, SearchState, SearchView } from 'features/search/types'
import { analytics } from 'libs/analytics/provider'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { BackButton } from 'ui/components/headers/BackButton'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const SEARCH_DEBOUNCE_MS = 500

type Props = UseSearchBoxProps & {
  addSearchHistory: (item: CreateHistoryItem) => void
  searchInHistory: (search: string) => void
  accessibleHiddenTitle?: string
  offerCategories?: SearchGroupNameEnumv2[]
  placeholder?: string
}

const accessibilityDescribedBy = uuidv4()

const BOOK_KEYWORD_PATTERN = /\bLIVRES?\b$/i
const CINEMA_KEYWORD_PATTERN = /\bCIN[ÉE]MA?S?\b$/i

export const SearchBox: React.FunctionComponent<Props> = ({
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
  const { goBack } = useGoBack(...homeNavigationConfig)
  const { showErrorSnackBar } = useSnackBarContext()
  const [displayedQuery, setDisplayedQuery] = useState<string>(searchState.query)
  const inputRef = useRef<RNTextInput | null>(null)
  const route = useRoute()
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')
  const { navigateToSearch: navigateToThematicSearch } = useNavigateToSearch('ThematicSearch')
  const currentView = route.name

  const {
    data: { displayNewSearchHeader },
  } = useRemoteConfigQuery()

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
    (
      partialSearchState: Partial<SearchState>,
      options: { reset?: boolean } = {},
      hasSearchedForBookKeyword?: boolean,
      hasSearchedForCinemaKeyword?: boolean
    ) => {
      const newSearchState = {
        ...searchState,
        ...(options.reset ? initialSearchState : {}),
        ...partialSearchState,
      }

      dispatch({
        type: 'SET_STATE',
        payload: newSearchState,
      })

      if (hasSearchedForBookKeyword || hasSearchedForCinemaKeyword) {
        return navigateToThematicSearch(newSearchState, defaultDisabilitiesProperties)
      }

      if (newSearchState.query !== '') {
        navigateToSearchResults(newSearchState, defaultDisabilitiesProperties)
      }
    },
    [dispatch, navigateToThematicSearch, navigateToSearchResults, searchState]
  )

  const hasEditableSearchInput = displayNewSearchHeader
    ? isFocusOnSuggestions
    : isFocusOnSuggestions ||
      currentView === SearchView.Results ||
      currentView === SearchView.Thematic

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

  const unfocus = useCallback(() => {
    Keyboard.dismiss()
    setQuery(searchState.query)
    hideSuggestions()
  }, [hideSuggestions, searchState.query, setQuery])

  const onPressArrowBack = useCallback(() => {
    if (isFocusOnSuggestions) {
      unfocus()
      return
    }
    Keyboard.dismiss()
    setQuery('')
    dispatch({
      type: 'SET_STATE',
      payload: {
        ...initialSearchState,
        locationFilter: searchState.locationFilter,
        offerCategories: offerCategories ?? searchState.offerCategories,
      },
    })
    goBack()
  }, [
    dispatch,
    goBack,
    isFocusOnSuggestions,
    offerCategories,
    searchState.locationFilter,
    searchState.offerCategories,
    setQuery,
    unfocus,
  ])

  const onSubmitQuery = useCallback(
    (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      const queryText = event.nativeEvent.text
      if (queryText.length > 150) {
        showErrorSnackBar({
          message: 'Ta recherche ne peut pas faire plus de 150 caractères.',
          timeout: SNACK_BAR_TIME_OUT,
        })
        return
      }
      if (queryText.length < 1 && Platform.OS !== 'android') return
      // When we hit enter, we may have selected a category or a venue on the search landing page
      // these are the two potentially 'staged' filters that we want to commit to the global search state.
      // We also want to commit the price filter, as beneficiary users may have access to different offer
      // price range depending on their available credit.
      addSearchHistory({ query: queryText })
      const searchId = uuidv4()

      let partialSearchState: Partial<SearchState> = {
        query: queryText,
        locationFilter: searchState.locationFilter,
        venue: searchState.venue,
        offerCategories: searchState.offerCategories,
        offerNativeCategories: searchState.offerNativeCategories,
        gtls: searchState.gtls,
        priceRange: searchState.priceRange,
        searchId,
        isAutocomplete: undefined,
        isFromHistory: undefined,
      }

      if (currentView === SearchView.Thematic) {
        partialSearchState = {
          ...partialSearchState,
          offerCategories,
          offerNativeCategories: [],
          gtls: [],
        }
      }

      let hasSearchedForBookKeyword = false
      let hasSearchedForCinemaKeyword = false
      if (currentView === SearchView.Landing) {
        hasSearchedForBookKeyword = BOOK_KEYWORD_PATTERN.test(queryText.trim())
        hasSearchedForCinemaKeyword = CINEMA_KEYWORD_PATTERN.test(queryText.trim())

        if (hasSearchedForBookKeyword || hasSearchedForCinemaKeyword) {
          partialSearchState = {
            ...partialSearchState,
            query: queryText.trim(),
            offerCategories: hasSearchedForBookKeyword
              ? [SearchGroupNameEnumv2.LIVRES]
              : [SearchGroupNameEnumv2.CINEMA],
          }
        }

        if (
          CINEMA_KEYWORD_PATTERN.test(
            queryText
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .trim()
          )
        ) {
          analytics.logHasSearchedCinemaQuery()
        }
      }

      pushWithSearch(partialSearchState, {}, hasSearchedForBookKeyword, hasSearchedForCinemaKeyword)
      hideSuggestions()
    },
    [
      addSearchHistory,
      currentView,
      searchState.locationFilter,
      searchState.venue,
      searchState.offerCategories,
      searchState.offerNativeCategories,
      searchState.gtls,
      searchState.priceRange,
      pushWithSearch,
      hideSuggestions,
      showErrorSnackBar,
      offerCategories,
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
    (currentView === SearchView.Results || currentView === SearchView.Thematic) &&
    !isFocusOnSuggestions

  const disableInputClearButton =
    (currentView === SearchView.Results || currentView === SearchView.Thematic) &&
    !isFocusOnSuggestions &&
    !isDesktopViewport

  return (
    <RowContainer>
      {accessibleHiddenTitle ? (
        <HiddenAccessibleText {...getHeadingAttrs(1)}>{accessibleHiddenTitle}</HiddenAccessibleText>
      ) : null}
      <SearchInputContainer {...props}>
        <SearchInputA11yContainer>
          {hasEditableSearchInput ? (
            <StyledView>
              <BackButton onGoBack={displayNewSearchHeader ? unfocus : onPressArrowBack} />
            </StyledView>
          ) : null}
          <FlexView>
            <HiddenSuggestionsButton />
            <SearchMainInput
              ref={inputRef}
              query={displayedQuery}
              setQuery={setQuery}
              onSubmitQuery={onSubmitQuery}
              resetQuery={resetQuery}
              isFocusable={isFocusOnSuggestions}
              onFocus={onFocus}
              disableInputClearButton={disableInputClearButton}
              placeholder={placeholder}
              showLocationButton={showLocationButton}
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
  width: '100%',
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

const StyledView = styled.View(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.designSystem.size.spacing.xxxl,
  height: theme.designSystem.size.spacing.xxxl,
}))

const FlexView = styled.View({
  flex: 1,
  flexDirection: 'row',
})
