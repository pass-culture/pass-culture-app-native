import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { SearchInput } from 'ui/components/inputs/SearchInput'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

interface Props {
  onChangeText?: (text: string) => void
  value?: string
}

const getLeftIcon = (currentValue: string, onPress: () => void) => {
  if (!currentValue) return <MagnifyingGlass />
  return (
    <TouchableOpacity onPress={onPress}>
      <ArrowPrevious />
    </TouchableOpacity>
  )
}

export const SearchBox: React.FC<Props> = ({ onChangeText, value = '' }) => {
  const [currentValue, setCurrentValue] = useState<string>(value)

  const handleChangeText = (newValue: string) => {
    onChangeText && onChangeText(newValue)
    setCurrentValue(newValue)
  }
  const resetSearch = () => setCurrentValue(value)

  return (
    <StyledInput>
      <SearchInput
        value={currentValue}
        onChangeText={handleChangeText}
        placeholder="Chercher par titre, artiste, ..."
        autoFocus={true}
        inputHeight="tall"
        LeftIcon={() => getLeftIcon(currentValue, resetSearch)}
      />
    </StyledInput>
  )
}

const StyledInput = styled.View({
  width: '100%',
})
