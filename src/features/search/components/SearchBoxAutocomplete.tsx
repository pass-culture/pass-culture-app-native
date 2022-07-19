import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch-hooks'
import {
  Keyboard,
  NativeSyntheticEvent,
  Platform,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { LocationType } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { usePushWithStagedSearch } from 'features/search/pages/usePushWithStagedSearch'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
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
  accessibleHiddenTitle?: string
}

const SEARCH_DEBOUNCE_MS = 500

export const SearchBoxAutocomplete: React.FC<Props> = ({
  searchInputID,
  showLocationButton,
  accessibleHiddenTitle,
  ...props
}) => {
  const { params } = useRoute<UseRouteType<'Search'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState: stagedSearchState, dispatch: stagedDispatch } = useStagedSearch()
  const accessibilityDescribedBy = uuidv4()
  const { locationFilter } = stagedSearchState
  const { locationType } = locationFilter
  // PLACE and VENUE belong to the same section
  const section = locationType === LocationType.VENUE ? LocationType.PLACE : locationType
  const { label: locationLabel } = useLocationChoice(section)
  const inputRef = useRef<RNTextInput | null>(null)
  const { query, refine } = useSearchBox(props)
  const [value, setValue] = useState<string>(query)
  const debounceRefine = useRef(debounce(refine, SEARCH_DEBOUNCE_MS)).current
  const showPreviousButton = params && params?.view !== SearchView.Landing
  const pushWithStagedSearch = usePushWithStagedSearch()

  //console.log({ query })

  // Track when the value coming from the React state changes to synchronize
  // it with InstantSearch.
  useEffect(() => {
    if (query !== value) {
      debounceRefine(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, debounceRefine])

  // Track when the InstantSearch query changes to synchronize it with
  // the React state.
  useEffect(() => {
    // We bypass the state update if the input is focused to avoid concurrent
    // updates when typing.
    if (!inputRef.current?.isFocused() && query !== value && params?.query === '') {
      setValue(query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    if (!params?.query) return
    // If the user select a value in autocomplete list it must be display in search input
    setValue(params.query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.query])

  const resetQuery = useCallback(() => {
    pushWithStagedSearch({ query: '', view: SearchView.Landing })
    setValue('')
    // To force remove focus on search input
    Keyboard.dismiss()
  }, [pushWithStagedSearch])

  const onPressArrowBack = () => {
    // Only close autocomplete list if open
    if (params?.view === SearchView.Suggestions) {
      pushWithStagedSearch({
        ...params,
        view: SearchView.Results,
      })

      // To force remove focus on search input
      Keyboard.dismiss()
      return
    }

    stagedDispatch({ type: 'SET_QUERY', payload: '' })
    pushWithStagedSearch({
      query: '',
      view: SearchView.Landing,
    })
    setValue('')
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
    pushWithStagedSearch({
      view: SearchView.Results,
      query: queryText,
      locationFilter,
      offerCategories,
      priceRange,
    })
    analytics.logSearchQuery(queryText)
  }

  const onFocus = () => {
    if (params?.view === SearchView.Suggestions) return
    pushWithStagedSearch({
      ...params,
      view: SearchView.Suggestions,
    })
  }

  return (
    <View testID="searchBoxWithAutocomplete">
      {!!accessibleHiddenTitle && (
        <HiddenAccessibleText {...getHeadingAttrs(1)}>{accessibleHiddenTitle}</HiddenAccessibleText>
      )}
      <SearchInputContainer marginHorizontal={showPreviousButton ? getSpacing(6) : 0}>
        {showPreviousButton ? (
          <StyledTouchableOpacity testID="previousButton" onPress={onPressArrowBack}>
            <ArrowPrevious />
          </StyledTouchableOpacity>
        ) : null}
        <StyledSearchInput
          searchInputID={searchInputID}
          value={value}
          onChangeText={setValue}
          placeholder={t`Offre, artiste...`}
          autoFocus={params?.view === SearchView.Suggestions}
          inputHeight="regular"
          LeftIcon={() => <MagnifyingGlassIcon />}
          onSubmitEditing={onSubmitQuery}
          onPressRightIcon={resetQuery}
          onFocus={onFocus}
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
    </View>
  )
}

const StyledSearchInput = styled(SearchInput)({
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
