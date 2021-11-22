import React from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  onPressOption: (option: string) => void
  option: string
}

export const AddressOption = ({ option, onPressOption }: Props) => {
  return (
    <StyledTouchableOpacity onPress={() => onPressOption(option)}>
      <Typo.Body>{option}</Typo.Body>
      <Spacer.Column numberOfSpaces={2} />
      <Separator />
    </StyledTouchableOpacity>
  )
}

const StyledTouchableOpacity = styled.TouchableOpacity({
  flexDirection: 'column',
  justifyContent: 'flex-start',
  paddingVertical: getSpacing(2),
})
