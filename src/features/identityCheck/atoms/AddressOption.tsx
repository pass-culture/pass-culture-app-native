import React from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const AddressOption = ({ label }: { label: string }) => {
  return (
    <StyledTouchableOpacity>
      <Typo.Body>{label}</Typo.Body>
      <Spacer.Column numberOfSpaces={2} />
      <Separator />
    </StyledTouchableOpacity>
  )
}

const StyledTouchableOpacity = styled.TouchableOpacity({
  flexDirection: 'column',
  justifyContent: 'flex-start',
  paddingVertical: getSpacing(2),
  paddingHorizontal: 0,
})
