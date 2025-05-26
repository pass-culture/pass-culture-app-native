import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

export const TicketVisual = ({ children }: { children: React.JSX.Element }) => {
  return <StyledBody>{children}</StyledBody>
}

const StyledBody = styled(View)({
  alignItems: 'center',
  width: '100%',
})
