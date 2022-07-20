import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Insets,
  NativeSyntheticEvent,
  Platform,
  TextInputSubmitEditingEventData,
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

type Props = {
  searchInputID: string
  showLocationButton?: boolean
  accessibleHiddenTitle?: string
}

export const SearchBox: React.FC<Props> = ({
  searchInputID,
  showLocationButton,
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
  const pushWithStagedSearch = usePushWithStagedSearch()
  const hasEditableSearchInput =
    SearchView.Suggestions === params?.view || SearchView.Results === params?.view

  useEffect(() => {
    setQuery(params?.query || '')
  }, [params?.query])

  const resetQuery = useCallback(() => {
    pushWithStagedSearch({
      query: '',
    })
  }, [pushWithStagedSearch])

  const onPressArrowBack = useCallback(() => {
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
  }, [locationFilter, pushWithStagedSearch, stagedDispatch])

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
    if (hasEditableSearchInput) return

    pushWithStagedSearch({
      ...params,
      view: SearchView.Suggestions,
    })
  }, [params, hasEditableSearchInput, pushWithStagedSearch])

  return (
    <RowContainer>
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
          showLocationButton={showLocationButton}
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
