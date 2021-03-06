import { t } from '@lingui/macro'
import React, { useEffect, useState } from 'react'
import {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
} from 'react-native'
import styled from 'styled-components/native'

import { useSearch } from 'features/search/pages/SearchWrapper'
import { analytics } from 'libs/analytics'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

const LeftIcon: React.FC<{ onPressArrowBack: () => void }> = ({ onPressArrowBack }) => {
  const { searchState } = useSearch()
  if (searchState.showResults)
    return (
      <ArrowPreviousContainer onPress={onPressArrowBack}>
        <ArrowPrevious />
      </ArrowPreviousContainer>
    )
  return <MagnifyingGlass />
}

const RightIcon: React.FC<{ currentValue: string; onPress: () => void }> = (props) =>
  props.currentValue.length > 0 ? (
    <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={props.onPress}>
      <Invalidate size={24} />
    </TouchableOpacity>
  ) : null

export const SearchBox: React.FC = () => {
  const { searchState, dispatch } = useSearch()
  const [query, setQuery] = useState<string>('')

  useEffect(() => {
    setQuery(searchState.query)
  }, [searchState.query])

  const resetSearch = () => {
    setQuery('')
    dispatch({ type: 'SET_QUERY', payload: '' })
  }

  const onPressArrowBack = () => {
    setQuery('')
    dispatch({ type: 'SET_QUERY', payload: '' })
    dispatch({ type: 'SHOW_RESULTS', payload: false })
    dispatch({ type: 'INIT' })
  }

  const onSubmitQuery = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    dispatch({ type: 'SET_QUERY', payload: query })
    dispatch({ type: 'SHOW_RESULTS', payload: true })
    analytics.logSearchQuery(event.nativeEvent.text)
  }

  return (
    <StyledInput>
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
    </StyledInput>
  )
}

const StyledInput = styled.View({ width: '100%' })
const ArrowPreviousContainer = styled.TouchableOpacity({})
