import { t } from '@lingui/macro'
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
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { FilterButton } from 'features/search/atoms/Buttons/FilterButton/FilterButton'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useLocationType } from 'features/search/pages/useLocationType'
import { usePushWithStagedSearch } from 'features/search/pages/usePushWithStagedSearch'
import { SearchView } from 'features/search/types'
import { useFilterCount } from 'features/search/utils/useFilterCount'
import { analytics } from 'libs/firebase/analytics'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { useLocationChoice } from './locationChoice.utils'
import { SearchMainInput } from './SearchMainInput'

const SEARCH_DEBOUNCE_MS = 500

type Props = UseSearchBoxProps & {
  searchInputID: string
  accessibleHiddenTitle?: string
}

export const SearchBox: React.FunctionComponent<Props> = ({
  searchInputID,
  accessibleHiddenTitle,
  ...props
}) => {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState: stagedSearchState, dispatch: stagedDispatch } = useStagedSearch()
  const { searchState } = useSearch()
  const [query, setQuery] = useState<string>(params?.query || '')
  const accessibilityDescribedBy = uuidv4()
  const { locationFilter, section } = useLocationType(searchState)
  const { label: locationLabel } = useLocationChoice(section)
  const inputRef = useRef<RNTextInput | null>(null)
  // Autocompletion inspired by https://github.com/algolia/doc-code-samples/tree/master/react-instantsearch-hooks-native/getting-started
  const { query: autocompleteQuery, refine: setAutocompleteQuery, clear } = useSearchBox(props)
  // An issue was opened to ask the integration of debounce directly in the lib : https://github.com/algolia/react-instantsearch/discussions/3555
  const debounceSetAutocompleteQuery = useRef(
    debounce(setAutocompleteQuery, SEARCH_DEBOUNCE_MS)
  ).current
  const { data: appSettings } = useAppSettings()
  const appEnableAutocomplete = appSettings?.appEnableAutocomplete ?? false

  const pushWithStagedSearch = usePushWithStagedSearch()
  const hasEditableSearchInput =
    params?.view === SearchView.Suggestions || params?.view === SearchView.Results
  const activeFilters = useFilterCount(searchState)

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
    pushWithStagedSearch({ query: '', view })
  }, [clear, appEnableAutocomplete, pushWithStagedSearch])

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
      pushWithStagedSearch({
        ...params,
        view: SearchView.Results,
      })

      return
    }

    stagedDispatch({
      type: 'SET_STATE',
      payload: { locationFilter },
    })
    pushWithStagedSearch(
      {
        query: '',
        view: SearchView.Landing,
        locationFilter,
      },
      {
        reset: true,
      }
    )
    setQuery('')
  }, [appEnableAutocomplete, locationFilter, params, pushWithStagedSearch, stagedDispatch])

  const onPressLocationButton = useCallback(() => {
    navigate('LocationFilter')
  }, [navigate])

  const onSubmitQuery = useCallback(
    (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      const queryText = event.nativeEvent.text
      if (queryText.length < 1 && Platform.OS !== 'android') return
      // When we hit enter, we may have selected a category or a venue on the search landing page
      // these are the two potentially 'staged' filters that we want to commit to the global search state.
      // We also want to commit the price filter, as beneficiary users may have access to different offer
      // price range depending on their available credit.
      const { offerCategories, priceRange } = stagedSearchState
      pushWithStagedSearch({
        query: queryText,
        locationFilter,
        offerCategories,
        priceRange,
        view: SearchView.Results,
      })
      analytics.logSearchQuery(queryText)
    },
    [locationFilter, pushWithStagedSearch, stagedSearchState]
  )

  const paramsWithoutView = useMemo(() => omit(params, ['view']), [params])
  const onFocus = useCallback(() => {
    if (params?.view === SearchView.Suggestions && appEnableAutocomplete) return

    // Avoid the redirection on suggestions view when user is on a results view
    // (not useful in this case because we don't have suggestions)
    // or suggestions view if it's the current view when feature flag desactivated
    if (hasEditableSearchInput && !appEnableAutocomplete) return

    pushWithStagedSearch({
      ...paramsWithoutView,
      view: SearchView.Suggestions,
      previousView: params?.view,
    })
  }, [
    appEnableAutocomplete,
    hasEditableSearchInput,
    params?.view,
    paramsWithoutView,
    pushWithStagedSearch,
  ])

  return (
    <RowContainer>
      {!!accessibleHiddenTitle && (
        <HiddenAccessibleText {...getHeadingAttrs(1)}>{accessibleHiddenTitle}</HiddenAccessibleText>
      )}
      <SearchInputContainer {...props}>
        {!!hasEditableSearchInput && (
          <StyledTouchableOpacity testID="previousButton" onPress={onPressArrowBack}>
            <ArrowPrevious />
          </StyledTouchableOpacity>
        )}
        <SearchMainInput
          ref={inputRef}
          searchInputID={searchInputID}
          query={query}
          setQuery={setQuery}
          isFocusable={false}
          isFocus={params?.view === SearchView.Suggestions}
          onSubmitQuery={onSubmitQuery}
          resetQuery={resetQuery}
          onFocus={onFocus}
          showLocationButton={params === undefined || params.view === SearchView.Landing}
          locationLabel={locationLabel}
          onPressLocationButton={onPressLocationButton}
        />
        {params?.view === SearchView.Results && <FilterButton activeFilters={activeFilters} />}
      </SearchInputContainer>
      <HiddenAccessibleText nativeID={accessibilityDescribedBy}>
        {t`Indique le nom d'une offre ou d'un lieu puis lance la recherche à l'aide de la touche
          "Entrée"`}
      </HiddenAccessibleText>
    </RowContainer>
  )
}

const RowContainer = styled.View({
  flexDirection: 'row',
})

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const SearchInputContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
})

const StyledTouchableOpacity = styled(TouchableOpacity)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: getSpacing(10),
  height: getSpacing(10),
  marginRight: getSpacing(2),
})
