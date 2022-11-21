import { useNavigation, useRoute } from '@react-navigation/native'
import debounce from 'lodash/debounce'
import omit from 'lodash/omit'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch-hooks'
import {
  NativeSyntheticEvent,
  Platform,
  TextInputSubmitEditingEventData,
  TextInput as RNTextInput,
  Keyboard,
} from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAppSettings } from 'features/auth/settings'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { FilterButton } from 'features/search/components/Buttons/FilterButton/FilterButton'
import { HiddenNavigateToSuggestionsButton } from 'features/search/components/Buttons/HiddenNavigateToSuggestionsButton'
import { SearchMainInput } from 'features/search/components/SearchMainInput/SearchMainInput'
import { initialSearchState } from 'features/search/context/reducer'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useAppliedFilters } from 'features/search/helpers/useAppliedFilters/useAppliedFilters'
import { useFilterCount } from 'features/search/helpers/useFilterCount/useFilterCount'
import { useHasPosition } from 'features/search/helpers/useHasPosition/useHasPosition'
import { useLocationChoice } from 'features/search/helpers/useLocationChoice/useLocationChoice'
import { useLocationType } from 'features/search/helpers/useLocationType/useLocationType'
import { LocationModal } from 'features/search/pages/modals/LocationModal/LocationModal'
import { SearchState, SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { BackButton } from 'ui/components/headers/BackButton'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { useModal } from 'ui/components/modals/useModal'
import { getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const SEARCH_DEBOUNCE_MS = 500

type Props = UseSearchBoxProps & {
  searchInputID: string
  accessibleHiddenTitle?: string
}

const accessibilityDescribedBy = uuidv4()

export const SearchBox: React.FunctionComponent<Props> = ({
  searchInputID,
  accessibleHiddenTitle,
  ...props
}) => {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { searchState } = useSearch()
  const { navigate } = useNavigation<UseNavigationType>()
  const [query, setQuery] = useState<string>(params?.query || '')
  const { locationFilter, section } = useLocationType(searchState)
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
  const { data: appSettings } = useAppSettings()
  const appEnableAutocomplete = appSettings?.appEnableAutocomplete ?? false
  const isLandingOrResults =
    params === undefined || params.view === SearchView.Landing || params.view === SearchView.Results

  const pushWithSearch = useCallback(
    (partialSearchState: Partial<SearchState>, options: { reset?: boolean } = {}) => {
      navigate(
        ...getTabNavConfig('Search', {
          ...searchState,
          ...(options.reset ? initialSearchState : {}),
          ...partialSearchState,
        })
      )
    },
    [navigate, searchState]
  )

  const hasEditableSearchInput =
    params?.view === SearchView.Suggestions || params?.view === SearchView.Results
  const activeFilters = useFilterCount(searchState)

  const hasPosition = useHasPosition()
  const appliedFilters = useAppliedFilters(searchState)

  // Track when the value coming from the React state changes to synchronize
  // it with InstantSearch.
  useEffect(() => {
    if (autocompleteQuery !== query && appEnableAutocomplete) {
      debounceSetAutocompleteQuery(query)
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
    if (params?.query) setQuery(params.query)
  }, [params?.query])

  useEffect(() => {
    if (!params?.noFocus && params?.view === SearchView.Results && !appEnableAutocomplete) {
      inputRef.current?.focus()
    }
  }, [appEnableAutocomplete, params?.query, params?.view, params?.noFocus])

  const resetQuery = useCallback(() => {
    inputRef.current?.focus()
    clear()
    setQuery('')
    const view = appEnableAutocomplete ? SearchView.Suggestions : SearchView.Results
    pushWithSearch({ query: '', view })
  }, [clear, appEnableAutocomplete, pushWithSearch])

  const onPressArrowBack = useCallback(() => {
    // To force remove focus on search input
    Keyboard.dismiss()
    // Only close autocomplete list if open
    const previousView = params?.previousView ? params?.previousView : SearchView.Landing
    if (
      params?.view === SearchView.Suggestions &&
      previousView !== SearchView.Landing &&
      appEnableAutocomplete
    ) {
      pushWithSearch({
        ...params,
        view: SearchView.Results,
      })

      return
    }

    pushWithSearch(
      {
        locationFilter,
      },
      {
        reset: true,
      }
    )
    setQuery('')
  }, [appEnableAutocomplete, locationFilter, params, pushWithSearch])

  const onSubmitQuery = useCallback(
    (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      const queryText = event.nativeEvent.text
      if (queryText.length < 1 && Platform.OS !== 'android') return
      // When we hit enter, we may have selected a category or a venue on the search landing page
      // these are the two potentially 'staged' filters that we want to commit to the global search state.
      // We also want to commit the price filter, as beneficiary users may have access to different offer
      // price range depending on their available credit.
      const { offerCategories, priceRange } = searchState
      const searchId = uuidv4()
      pushWithSearch({
        query: queryText,
        locationFilter,
        offerCategories,
        priceRange,
        view: SearchView.Results,
        searchId,
      })
      analytics.logSearchQuery(queryText, appliedFilters, searchId)
    },
    [appliedFilters, locationFilter, pushWithSearch, searchState]
  )

  const paramsWithoutView = useMemo(() => omit(params, ['view']), [params])
  const onFocus = useCallback(() => {
    if (params?.view === SearchView.Suggestions && appEnableAutocomplete) return

    // Avoid the redirection on suggestions view when user is on a results view
    // (not useful in this case because we don't have suggestions)
    // or suggestions view if it's the current view when feature flag desactivated
    if (hasEditableSearchInput && !appEnableAutocomplete) return

    pushWithSearch({
      ...paramsWithoutView,
      view: SearchView.Suggestions,
      previousView: params?.view,
    })
  }, [
    appEnableAutocomplete,
    hasEditableSearchInput,
    params?.view,
    paramsWithoutView,
    pushWithSearch,
  ])

  return (
    <RowContainer>
      {!!accessibleHiddenTitle && (
        <HiddenAccessibleText {...getHeadingAttrs(1)}>{accessibleHiddenTitle}</HiddenAccessibleText>
      )}
      <SearchInputContainer {...props}>
        <SearchInputA11yContainer>
          <FlexView>
            {!!isLandingOrResults && <HiddenNavigateToSuggestionsButton />}
            <SearchMainInput
              ref={inputRef}
              searchInputID={searchInputID}
              query={query}
              setQuery={setQuery}
              isFocusable={!isLandingOrResults}
              isFocus={params?.view === SearchView.Suggestions}
              onSubmitQuery={onSubmitQuery}
              resetQuery={resetQuery}
              onFocus={onFocus}
              showLocationButton={params === undefined || params.view === SearchView.Landing}
              locationLabel={hasPosition ? locationLabel : 'Me localiser'}
              onPressLocationButton={showLocationModal}
            />
          </FlexView>
          {!!hasEditableSearchInput && (
            <StyledView>
              <BackButton onGoBack={onPressArrowBack} />
            </StyledView>
          )}
        </SearchInputA11yContainer>
        {params?.view === SearchView.Results && <FilterButton activeFilters={activeFilters} />}
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
  flexDirection: 'row-reverse',
  alignItems: 'center',
})

const StyledView = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: getSpacing(10),
  height: getSpacing(10),
  marginRight: getSpacing(2),
})

const FlexView = styled.View({
  flex: 1,
  flexDirection: 'row',
})
