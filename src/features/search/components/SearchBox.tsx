import React, { useState } from 'react'
import { connectSearchBox } from 'react-instantsearch-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

interface Props {
  refine: (text: string) => void
  value?: string
}

const getRightIcon = (currentValue: string, onPress: () => void) =>
  currentValue ? (
    <TouchableOpacity onPress={onPress}>
      <Invalidate size={24} />
    </TouchableOpacity>
  ) : null

const SearchBoxComponent: React.FC<Props> = ({ refine, value = '' }) => {
  const [currentValue, setCurrentValue] = useState<string>(value)

  const handleChangeText = (newValue: string) => {
    refine(newValue)
    setCurrentValue(newValue)
  }
  const resetSearch = () => handleChangeText('')

  return (
    <StyledInput>
      <SearchInput
        value={currentValue}
        onChangeText={handleChangeText}
        placeholder="Chercher par titre, artiste, ..."
        autoFocus={false}
        inputHeight="tall"
        LeftIcon={() => <MagnifyingGlass />}
        RightIcon={() => getRightIcon(currentValue, resetSearch)}
      />
    </StyledInput>
  )
}

const StyledInput = styled.View({ width: '100%' })

export const SearchBox = connectSearchBox(SearchBoxComponent)
