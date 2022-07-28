import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch-hooks'
import {
  Insets,
  NativeSyntheticEvent,
  Platform,
  TextInputSubmitEditingEventData,
  TextInput as RNTextInput,
  Keyboard,
} from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { LocationType } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { usePushWithStagedSearch } from 'features/search/pages/usePushWithStagedSearch'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { useLocationChoice } from './locationChoice.utils'
import { SearchMainInput } from './SearchMainInput'

const inset = 25 // arbitrary hitSlop zone inset for touchable
const hitSlop: Insets = { top: inset, right: inset, bottom: inset, left: inset }
const SEARCH_DEBOUNCE_MS = 500

type Props = UseSearchBoxProps & {
  searchInputID: string
  accessibleHiddenTitle?: string
}

export const SearchBoxAutocomplete: React.FC<Props> = ({
  searchInputID,
  accessibleHiddenTitle,
  ...props
}) => {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState: stagedSearchState, dispatch: stagedDispatch } = useStagedSearch()
  const [query, setQuery] = useState<string>(params?.query || '')
  const accessibilityDescribedBy = uuidv4()
  const { locationFilter } = stagedSearchState
  const { locationType } = locationFilter
  // PLACE and VENUE belong to the same section
  const section = locationType === LocationType.VENUE ? LocationType.PLACE : locationType
  const { label: locationLabel } = useLocationChoice(section)
  const inputRef = useRef<RNTextInput | null>(null)
  const { query: autocompleteQuery, refine: setAutocompleteQuery, clear } = useSearchBox(props)
  const debounceSetAutocompleteQuery = useRef(
    debounce(setAutocompleteQuery, SEARCH_DEBOUNCE_MS)
  ).current

  const pushWithStagedSearch = usePushWithStagedSearch()
  const hasEditableSearchInput =
    params?.view === SearchView.Suggestions || params?.view === SearchView.Results

  // Track when the value coming from the React state changes to synchronize
  // it with InstantSearch.
  useEffect(() => {
    if (autocompleteQuery !== query) {
      debounceSetAutocompleteQuery(query)
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autocompleteQuery])

  useEffect(() => {
    // If the user select a value in autocomplete list it must be display in search input
    if (params?.query) setQuery(params.query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.query])

  const resetQuery = useCallback(() => {
    clear()
    setQuery('')
    pushWithStagedSearch({ query: '', view: SearchView.Suggestions })
  }, [clear, pushWithStagedSearch])

  const onPressArrowBack = useCallback(() => {
    // Only close autocomplete list if open
    if (params?.view === SearchView.Suggestions && params?.query !== '') {
      pushWithStagedSearch({
        ...params,
        view: SearchView.Results,
      })

      // To force remove focus on search input
      Keyboard.dismiss()
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
  }, [locationFilter, params, pushWithStagedSearch, stagedDispatch])

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

  const onFocus = useCallback(() => {
    if (params?.view === SearchView.Suggestions) return

    pushWithStagedSearch({
      ...params,
      view: SearchView.Suggestions,
    })
  }, [params, pushWithStagedSearch])

  return (
    <RowContainer testID="searchBoxWithAutocomplete">
      {!!accessibleHiddenTitle && (
        <HiddenAccessibleText {...getHeadingAttrs(1)}>{accessibleHiddenTitle}</HiddenAccessibleText>
      )}
      <SearchInputContainer {...props}>
        {!!hasEditableSearchInput && (
          <StyledTouchableOpacity
            testID="previousButton"
            onPress={onPressArrowBack}
            hitSlop={hitSlop}>
            <ArrowPrevious />
          </StyledTouchableOpacity>
        )}
        <SearchMainInput
          searchInputID={searchInputID}
          query={query}
          setQuery={setQuery}
          isFocus={params?.view === SearchView.Suggestions}
          onSubmitQuery={onSubmitQuery}
          resetQuery={resetQuery}
          onFocus={onFocus}
          showLocationButton={params?.view === SearchView.Landing}
          locationLabel={locationLabel}
          onPressLocationButton={onPressLocationButton}
        />
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
  height: '100%',
  width: 50,
  marginRight: getSpacing(4),
})
