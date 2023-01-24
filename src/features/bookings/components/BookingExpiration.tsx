import React from 'react'
import styled from 'styled-components/native'

import { Spacer, Typo } from 'ui/theme'

export interface BookingExpirationProps {
  renderButton: () => JSX.Element
  expirationDate: string
}

export const BookingExpiration = ({ renderButton, expirationDate }: BookingExpirationProps) => {
  const expirationDateMessage = `Ta réservation expirera le ${expirationDate}`
  return (
    <React.Fragment>
      {renderButton()}
      <Spacer.Column numberOfSpaces={4} />
      <StyledCaption>{expirationDateMessage}</StyledCaption>
    </React.Fragment>
  )
}

const StyledCaption = styled(Typo.CaptionNeutralInfo)({
  textAlign: 'center',
})
