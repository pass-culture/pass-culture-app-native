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
import { FilterBehaviour } from 'features/search/enums'
import { getIsSearchPreviousRoute } from 'features/search/helpers/getIsSearchPreviousRoute/getIsSearchPreviousRoute'
import { useHasPosition } from 'features/search/helpers/useHasPosition/useHasPosition'
import { useLocationChoice } from 'features/search/helpers/useLocationChoice/useLocationChoice'
import { useLocationType } from 'features/search/helpers/useLocationType/useLocationType'
import { LocationModal } from 'features/search/pages/modals/LocationModal/LocationModal'
import { CreateHistoryItem, SearchState, SearchView } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import { BackButton } from 'ui/components/headers/BackButton'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { useModal } from 'ui/components/modals/useModal'
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
  const enableAppLocation = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_APP_LOCATION)
  const { isDesktopViewport } = useTheme()
  const { searchState, dispatch, isFocusOnSuggestions, hideSuggestions, showSuggestions } =
    useSearch()
  const { goBack } = useGoBack(...homeNavConfig)
  const [query, setQuery] = useState<string>(searchState.query)
  const { section, locationType } = useLocationType(searchState)
  const { label: locationLabel } = useLocationChoice(section)
  const inputRef = useRef<RNTextInput | null>(null)
  const {
    visible: locationModalVisible,
    showModal: showLocationModal,
    hideModal: hideLocationModal,
  } = useModal(false)
  // Autocompletion inspired by https://github.com/algolia/doc-code-samples/tree/master/react-instantsearch-hooks-native/getting-started
  const { query: autocompleteQuery, refine: setAutocompleteQuery, clear } = useSearchBox(props)
  // An issue was opened to ask the integration of debounce directly in the lib : https://github.com/algolia/react-instantsearch/discussions/3555
  const debounceSetAutocompleteQuery = useRef(
    debounce(setAutocompleteQuery, SEARCH_DEBOUNCE_MS)
  ).current
  const { data: appSettings } = useSettingsContext()
  const appEnableAutocomplete = appSettings?.appEnableAutocomplete

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

  const hasEditableSearchInput =
    searchState.view === SearchView.Suggestions || searchState.view === SearchView.Results

  const hasPosition = useHasPosition()

  // Track when the value coming from the React state changes to synchronize
  // it with InstantSearch.
  useEffect(() => {
    if (autocompleteQuery !== query && appEnableAutocomplete) {
      debounceSetAutocompleteQuery(query)
      searchInHistory(query)
    }
    // avoid conflicts when local autocomplete query state is updating
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, debounceSetAutocompleteQuery])

  // Track when the InstantSearch query changes to synchronize it with
  // the React state.
  useEffect(() => {
    // We bypass the state update if the input is focused to avoid concurrent
    // updates when typing.
    if (!inputRef.current?.isFocused() && autocompleteQuery !== query) {
      setQuery(autocompleteQuery)
    }
    // avoid conflicts when local query state is updating
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autocompleteQuery])

  useEffect(() => {
    // If the user select a value in autocomplete list it must be display in search input
    if (searchState.query !== query) setQuery(searchState.query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState.query])

  useEffect(() => {
    if (appEnableAutocomplete === undefined) return
    if (!searchState.noFocus && searchState.view === SearchView.Results && !appEnableAutocomplete) {
      inputRef.current?.focus()
    }
  }, [appEnableAutocomplete, searchState.query, searchState.view, searchState.noFocus])

  const resetQuery = useCallback(() => {
    inputRef.current?.focus()
    clear()
    setQuery('')
    searchInHistory('')
    const view = appEnableAutocomplete ? SearchView.Suggestions : SearchView.Results
    pushWithSearch({ query: '', view })
  }, [clear, appEnableAutocomplete, pushWithSearch, searchInHistory])

  const onPressArrowBack = useCallback(() => {
    // To force remove focus on search input
    Keyboard.dismiss()

    // TODO(PC-25976): remove this code when new venue page will be create
    // when pressing Voir toutes les offres on venue page
    const isSearchPreviousRoute = getIsSearchPreviousRoute(
      navigationRef.getState().routes,
      searchState.previousView
    )

    if (isSearchPreviousRoute) {
      // Only close autocomplete list if open
      const { previousView, view } = searchState
      if (
        view === SearchView.Suggestions &&
        previousView !== SearchView.Landing &&
        appEnableAutocomplete
      ) {
        return pushWithSearch({
          ...searchState,
          view: SearchView.Results,
          previousView: view,
        })
      }

      pushWithSearch(
        {
          locationFilter: searchState.locationFilter,
          venue: searchState.venue,
          previousView: view,
        },
        {
          reset: true,
        }
      )
    } else {
      dispatch({ type: 'SET_STATE', payload: { ...searchState, venue: undefined } })
      goBack()
    }

    setQuery('')
  }, [searchState, appEnableAutocomplete, pushWithSearch, dispatch, goBack])

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
    },
    [
      addSearchHistory,
      pushWithSearch,
      searchState.locationFilter,
      searchState.venue,
      searchState.offerCategories,
      searchState.priceRange,
    ]
  )

  const onFocus = useCallback(() => {
    if (searchState.view === SearchView.Suggestions && appEnableAutocomplete) return

    // Avoid the redirection on suggestions view when user is on a results view
    // (not useful in this case because we don't have suggestions)
    // or suggestions view if it's the current view when feature flag desactivated
    if (hasEditableSearchInput && !appEnableAutocomplete) return

    searchInHistory(searchState.query)
    pushWithSearch({
      ...searchState,
      view: SearchView.Suggestions,
      previousView: searchState.view,
    })
  }, [appEnableAutocomplete, hasEditableSearchInput, pushWithSearch, searchInHistory, searchState])

  const showLocationButton = enableAppLocation
    ? searchState.view === SearchView.Results
    : searchState.view === SearchView.Landing

  const disableInputClearButton =
    searchState.view === SearchView.Results && !isDesktopViewport && !!enableAppLocation

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
              query={query}
              setQuery={setQuery}
              isFocusable={isFocusOnSuggestions}
              onSubmitQuery={onSubmitQuery}
              resetQuery={resetQuery}
              onFocus={onFocus}
              showLocationButton={showLocationButton}
              locationLabel={hasPosition ? locationLabel : 'Me localiser'}
              onPressLocationButton={showLocationModal}
              accessibilityDescribedBy={accessibilityDescribedBy}
              numberOfLinesForLocation={locationType === LocationMode.AROUND_PLACE ? 1 : 2}
              disableInputClearButton={disableInputClearButton}
            />
          </FlexView>
        </SearchInputA11yContainer>
      </SearchInputContainer>
      <HiddenAccessibleText nativeID={accessibilityDescribedBy}>
        Indique le nom d’une offre ou d’un lieu puis lance la recherche à l’aide de la touche
        ”Entrée”
      </HiddenAccessibleText>
      <LocationModal
        title="Localisation"
        accessibilityLabel="Ne pas filtrer sur la localisation et retourner aux résultats"
        isVisible={locationModalVisible}
        hideModal={hideLocationModal}
        filterBehaviour={FilterBehaviour.APPLY_WITHOUT_SEARCHING}
      />
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
