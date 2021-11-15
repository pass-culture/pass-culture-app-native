import { t } from '@lingui/macro'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
} from 'react-native'

import { SearchView } from 'features/search/enums'
import {
  useCommitStagedSearch,
  useSearch,
  useSearchView,
} from 'features/search/pages/SearchWrapper'
import { analytics } from 'libs/analytics'
import { accessibilityAndTestId } from 'tests/utils'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { MagnifyingGlassDeprecated } from 'ui/svg/icons/MagnifyingGlass_deprecated'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

const LeftIcon: React.FC<{ onPressArrowBack: () => void }> = ({ onPressArrowBack }) => {
  const { searchView } = useSearchView()
  if (searchView === SearchView.RESULTS)
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
  const { commitStagedSearch } = useCommitStagedSearch()
  const { setSearchView } = useSearchView()
  const { searchState, dispatch } = useSearch()
  const [query, setQuery] = useState<string>('')

  useFocusEffect(
    useCallback(() => {
      setQuery(searchState.query)
    }, [searchState.query])
  )

  const resetSearch = () => {
    setQuery('')
    dispatch({ type: 'SET_QUERY', payload: '' })
  }

  const onPressArrowBack = () => {
    setQuery('')
    dispatch({ type: 'INIT' })
    setSearchView(SearchView.LANDING)
  }

  const onSubmitQuery = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const query = event.nativeEvent.text
    commitStagedSearch({ complementSearchState: { query } })
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
