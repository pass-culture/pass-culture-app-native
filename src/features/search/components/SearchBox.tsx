import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { analytics } from 'libs/analytics'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { MagnifyingGlass as DefaultMagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const LeftIcon: React.FC<{ onPressArrowBack: () => void }> = ({ onPressArrowBack }) => {
  const { searchState } = useSearch()
  if (searchState.showResults)
    return (
      <Touchable onPress={onPressArrowBack} {...accessibilityAndTestId(t`Revenir en arrière`)}>
        <ArrowPrevious />
      </Touchable>
    )
  return <MagnifyingGlass />
}

type Props = {
  searchInputID: string
}

export const SearchBox: React.FC<Props> = ({ searchInputID }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState, dispatch } = useSearch()
  const { searchState: stagedSearchState, dispatch: stagedDispatch } = useStagedSearch()
  const [query, _setQuery] = useState<string>('')
  const accessibilityDescribedBy = uuidv4()

  function setQuery(value: string) {
    stagedDispatch({ type: 'SET_QUERY', payload: value })
    _setQuery(value)
  }

  useFocusEffect(
    useCallback(() => {
      setQuery(searchState.query)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchState.query])
  )

  const resetSearch = () => {
    navigate(...getTabNavConfig('Search', { query: '' }))
    setQuery('')
  }

  const onPressArrowBack = () => {
    setQuery('')
    dispatch({ type: 'SET_QUERY', payload: '' })
    dispatch({ type: 'SHOW_RESULTS', payload: false })
    dispatch({ type: 'INIT' })
  }

  const onSubmitQuery = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const queryText = event.nativeEvent.text
    if (queryText.length < 1) return
    // When we hit enter, we may have selected a category or a venue on the search landing page
    // these are the two potentially 'staged' filters that we want to commit to the global search state.
    // We also want to commit the price filter, as beneficiary users may have access to different offer
    // price range depending on their available credit.
    const { locationFilter, offerCategories, priceRange } = stagedSearchState
    navigate(
      ...getTabNavConfig('Search', {
        showResults: true,
        query: queryText,
        locationFilter,
        offerCategories,
        priceRange,
      })
    )
    analytics.logSearchQuery(queryText)
  }

  return (
    <React.Fragment>
      <HiddenAccessibleText {...getHeadingAttrs(1)}>
        {t`Recherche une offre, un titre, un lieu...`}
      </HiddenAccessibleText>
      <StyledSearchInput
        searchInputID={searchInputID}
        value={query}
        onChangeText={setQuery}
        placeholder={t`Offre, artiste...`}
        autoFocus={false}
        inputHeight="regular"
        LeftIcon={() => <LeftIcon onPressArrowBack={onPressArrowBack} />}
        onSubmitEditing={onSubmitQuery}
        accessibilityLabel={t`Rechercher un artiste, titre, lieu...`}
        onPressRightIcon={resetSearch}
        accessibilityDescribedBy={accessibilityDescribedBy}
      />
      <HiddenAccessibleText nativeID={accessibilityDescribedBy}>
        {t`Indique le nom d'une offre ou d'un lieu puis lance la recherche à l'aide de la touche
        "Entrée"`}
      </HiddenAccessibleText>
    </React.Fragment>
  )
}

const StyledSearchInput = styled((props) => <SearchInput {...props} />).attrs(({ theme }) => ({
  focusOutlineColor: theme.colors.black,
}))({
  outlineOffset: 0,
})

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const MagnifyingGlass = styled(DefaultMagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
