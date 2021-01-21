import { t } from '@lingui/macro'
import debounce from 'lodash.debounce'
import React, { useRef, useState } from 'react'
import { connectSearchBox } from 'react-instantsearch-native'
import { TextInput as RNTextInput, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { useSearch } from 'features/search/pages/SearchWrapper'
import { _ } from 'libs/i18n'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

const SEARCH_DEBOUNCE_MS = 400

interface Props {
  refine: (text: string) => void
  value?: string
}

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

const SearchBoxComponent: React.FC<Props> = (props) => {
  const { refine, value = '' } = props
  const [currentValue, setCurrentValue] = useState<string>(value)
  const debouncedRefine = useRef(debounce(refine, SEARCH_DEBOUNCE_MS)).current
  const searchInputRef = useRef<RNTextInput | null>(null)
  const { dispatch } = useSearch()

  const handleChangeText = (newValue: string) => {
    debouncedRefine(newValue)
    setCurrentValue(newValue)
  }
  const resetSearch = () => {
    handleChangeText('')
    searchInputRef.current && searchInputRef.current.focus()
  }
  const onPressArrowBack = () => {
    handleChangeText('')
    dispatch({ type: 'SHOW_RESULTS', payload: false })
  }

  return (
    <StyledInput>
      <SearchInput
        ref={searchInputRef}
        value={currentValue}
        onChangeText={handleChangeText}
        placeholder={_(t`Chercher par titre, artiste...`)}
        autoFocus={false}
        inputHeight="tall"
        LeftIcon={() => <LeftIcon onPressArrowBack={onPressArrowBack} />}
        RightIcon={() => <RightIcon currentValue={currentValue} onPress={resetSearch} />}
        onBlur={() => dispatch({ type: 'SHOW_RESULTS', payload: true })}
      />
    </StyledInput>
  )
}

const StyledInput = styled.View({ width: '100%' })
const ArrowPreviousContainer = styled.TouchableOpacity({})

export const SearchBox = connectSearchBox(SearchBoxComponent)
