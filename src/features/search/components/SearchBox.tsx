import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
} from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { analytics } from 'libs/analytics'
import { HiddenText } from 'ui/components/HiddenText'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { MagnifyingGlass as DefaultMagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

const LeftIcon: React.FC<{ onPressArrowBack: () => void }> = ({ onPressArrowBack }) => {
  const { searchState } = useSearch()
  if (searchState.showResults)
    return (
      <TouchableOpacity
        onPress={onPressArrowBack}
        {...accessibilityAndTestId(t`Revenir en arrière`)}>
        <ArrowPrevious />
      </TouchableOpacity>
    )
  return <MagnifyingGlass />
}

export const SearchBox: React.FC = () => {
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
    // When we hit enter, we may have selected a category or a venue on the search landing page
    // these are the two potentially 'staged' filters that we want to commit to the global search state.
    // We also want to commit the price filter, as beneficiary users may have access to different offer
    // price range depending on their available credit.
    const { locationFilter, offerCategories, priceRange } = stagedSearchState
    const query = event.nativeEvent.text
    navigate(
      ...getTabNavConfig('Search', {
        showResults: true,
        query,
        locationFilter,
        offerCategories,
        priceRange,
      })
    )
    analytics.logSearchQuery(query)
  }

  return (
    <React.Fragment>
      <SearchInput
        value={query}
        onChangeText={setQuery}
        placeholder={t`Titre, artiste, lieu...`}
        autoFocus={false}
        inputHeight="tall"
        LeftIcon={() => <LeftIcon onPressArrowBack={onPressArrowBack} />}
        onSubmitEditing={onSubmitQuery}
        accessibilityLabel={t`Barre de recherche des offres`}
        onPressRightIcon={resetSearch}
        accessibilityDescribedBy={accessibilityDescribedBy}
      />
      <HiddenText nativeID={accessibilityDescribedBy}>
        {t`Indique le nom d'une offre ou d'un lieu puis lance la recherche à l'aide de la touche
        "Entrée"`}
      </HiddenText>
    </React.Fragment>
  )
}

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const MagnifyingGlass = styled(DefaultMagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
