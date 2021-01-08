import React, { useRef, useState } from 'react'
import { connectSearchBox } from 'react-instantsearch-native'
import styled from 'styled-components/native'
import debounce from 'lodash.debounce'

import { TextInput } from 'ui/components/inputs/TextInput'
import { getSpacing } from 'ui/theme'

interface Props {
  onChangeText: (text: string) => void
  value: string
}

export const SearchBoxComponent: React.FC<Props> = ({ onChangeText, value }) => (
  <StyledInput>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Chercher par titre, artiste, ..."
      autoFocus={true}
    />
  </StyledInput>
)

const StyledInput = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
  margin: getSpacing(4),
})

export const SearchBox = connectSearchBox(({ refine, currentRefinement }) => {
  const [value, setValue] = useState(currentRefinement)
  const debouncedRefine = useRef(debounce(refine, 400)).current

  return (
    <SearchBoxComponent
      onChangeText={(text: string) => {
        setValue(text)
        debouncedRefine(text)
      }}
      value={value}
    />
  )
})
