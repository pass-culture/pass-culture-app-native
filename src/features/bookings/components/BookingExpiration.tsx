import React, { ReactNode } from 'react'
import styled from 'styled-components/native'

import { Spacer, Typo } from 'ui/theme'

export interface BookingExpirationProps {
  children: ReactNode
  expirationDate: string
}

export const BookingExpiration = ({ children, expirationDate }: BookingExpirationProps) => {
  const expirationDateMessage = `Ta réservation expirera le ${expirationDate}`
  return (
    <React.Fragment>
      {children}
      <Spacer.Column numberOfSpaces={4} />
      <StyledCaption>{expirationDateMessage}</StyledCaption>
    </React.Fragment>
  )
}

const StyledCaption = styled(Typo.CaptionNeutralInfo)({
  textAlign: 'center',
})
