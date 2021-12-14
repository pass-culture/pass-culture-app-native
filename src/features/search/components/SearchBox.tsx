import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
} from 'react-native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { analytics } from 'libs/analytics'
import { accessibilityAndTestId } from 'tests/utils'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { MagnifyingGlassDeprecated } from 'ui/svg/icons/MagnifyingGlass_deprecated'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

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
  return <MagnifyingGlassDeprecated />
}

const RightIcon: React.FC<{ currentValue: string; onPress: () => void }> = (props) =>
  props.currentValue.length > 0 ? (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      onPress={props.onPress}
      {...accessibilityAndTestId(t`Réinitialiser la recherche`)}>
      <Invalidate size={24} />
    </TouchableOpacity>
  ) : null

export const SearchBox: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState, dispatch } = useSearch()
  const { searchState: stagedSearchState, dispatch: stagedDispatch } = useStagedSearch()
  const [query, _setQuery] = useState<string>('')

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
    // these are the two potentially 'staged' filters that we want to commit to the global search state
    const { locationFilter, offerCategories } = stagedSearchState
    const query = event.nativeEvent.text
    navigate(
      ...getTabNavConfig('Search', { showResults: true, query, locationFilter, offerCategories })
    )
    analytics.logSearchQuery(query)
  }

  return (
    <SearchInput
      value={query}
      onChangeText={setQuery}
      placeholder={t`Titre, artiste, lieu...`}
      autoFocus={false}
      inputHeight="tall"
      LeftIcon={() => <LeftIcon onPressArrowBack={onPressArrowBack} />}
      RightIcon={() => <RightIcon currentValue={query} onPress={resetSearch} />}
      onSubmitEditing={onSubmitQuery}
    />
  )
}
