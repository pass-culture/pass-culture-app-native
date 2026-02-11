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
import { HiddenSuggestionsButton } from 'features/search/components/Buttons/HiddenSuggestionsButton'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useNavigateToSearch } from 'features/search/helpers/useNavigateToSearch/useNavigateToSearch'
import { CreateHistoryItem, SearchState, SearchView } from 'features/search/types'
import { analytics } from 'libs/analytics/provider'
import Animated, { LinearTransition } from 'libs/react-native-reanimated'
import { useAppEnableAutocomplete } from 'queries/settings/useSettings'
import { BackButton } from 'ui/components/headers/BackButton'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { SearchInput } from 'ui/designSystem/SearchInput/SearchInput'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const SEARCH_DEBOUNCE_MS = 500

type Props = UseSearchBoxProps & {
  addSearchHistory: (item: CreateHistoryItem) => void
  searchInHistory: (search: string) => void
  accessibleHiddenTitle?: string
  offerCategories?: SearchGroupNameEnumv2[]
}

const accessibilityDescribedBy = uuidv4()

const BOOK_KEYWORD_PATTERN = /\bLIVRES?\b$/i
const CINEMA_KEYWORD_PATTERN = /\bCIN[ÉE]MA?S?\b$/i

export const SearchBox: React.FunctionComponent<Props> = ({
  accessibleHiddenTitle,
  addSearchHistory,
  searchInHistory,
  offerCategories,
  ...props
}) => {
  const { isDesktopViewport } = useTheme()
  const { searchState, dispatch, isFocusOnSuggestions, hideSuggestions, showSuggestions } =
    useSearch()
  const [displayedQuery, setDisplayedQuery] = useState<string>(searchState.query)
  const inputRef = useRef<RNTextInput | null>(null)
  const route = useRoute()
  const { navigateToSearch: navigateToSearchResults } = useNavigateToSearch('SearchResults')
  const { navigateToSearch: navigateToThematicSearch } = useNavigateToSearch('ThematicSearch')
  const currentView = route.name

  // Autocompletion inspired by https://github.com/algolia/doc-code-samples/tree/master/react-instantsearch-hooks-native/getting-started
  const { query: autocompleteQuery, refine: setAutocompleteQuery, clear } = useSearchBox(props)
  // An issue was opened to ask the integration of debounce directly in the lib : https://github.com/algolia/react-instantsearch/discussions/3555
  const debounceSetAutocompleteQuery = useRef(
    debounce(setAutocompleteQuery, SEARCH_DEBOUNCE_MS)
  ).current
  const { data: appEnableAutocomplete } = useAppEnableAutocomplete()

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

  const onSubmitQuery = useCallback(
    (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      const queryText = event.nativeEvent.text
      if (queryText.length > 150) {
        showErrorSnackBar('Ta recherche ne peut pas faire plus de 150 caractères.')
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
          void analytics.logHasSearchedCinemaQuery()
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
      offerCategories,
    ]
  )

  const onFocus = () => {
    if (isFocusOnSuggestions && appEnableAutocomplete) return
    // Avoid the redirection on suggestions view when user is on a results view
    // (not useful in this case because we don't have suggestions)
    // or suggestions view if it's the current view when feature flag deactivated
    if (isFocusOnSuggestions && !appEnableAutocomplete) return
    searchInHistory(searchState.query)
    showSuggestions()
  }

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
          {isFocusOnSuggestions ? (
            <StyledView>
              <BackButton onGoBack={unfocus} />
            </StyledView>
          ) : null}
          <FlexView layout={LinearTransition.duration(250)}>
            <HiddenSuggestionsButton />
            <SearchInput
              label="Rechercher dans le catalogue"
              ref={inputRef}
              value={displayedQuery}
              onChangeText={setQuery}
              onSubmitEditing={onSubmitQuery}
              onClear={resetQuery}
              nativeAutoFocus={Platform.OS !== 'web'}
              onFocus={onFocus}
              focusable={isFocusOnSuggestions}
              testID="searchInput"
              disableClearButton={disableInputClearButton}
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
  flex: 1,
})

const SearchInputA11yContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'flex-end',
})

const StyledView = styled.View(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.designSystem.size.spacing.xxxl,
  height: theme.designSystem.size.spacing.xxxl,
}))

const FlexView = styled(Animated.View)({
  flex: 1,
  flexDirection: 'row',
})
