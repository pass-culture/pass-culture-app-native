import React from 'react'
import styled from 'styled-components/native'

import { Typo, getSpacing } from 'ui/theme'

export const TicketText = ({ children, testID }: { children: string; testID?: string }) => {
  return (
    <TicketContainer testID={testID}>
      <StyledBody>{children}</StyledBody>
    </TicketContainer>
  )
}

const TicketContainer = styled.View({
  width: '100%',
  gap: getSpacing(4),
  flexDirection: 'column',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
  maxWidth: '100%',
})
