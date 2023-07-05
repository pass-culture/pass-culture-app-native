import React, { ReactNode } from 'react'
import styled from 'styled-components/native'

import { Spacer, Typo } from 'ui/theme'

interface BookingExpirationProps {
  children: ReactNode
  expirationDate: string
}

export const BookingExpiration = ({ children, expirationDate }: BookingExpirationProps) => {
  if (!expirationDate) {
    return null
  }
  const expirationDateMessage = `Ta réservation sera archivée le ${expirationDate}`
  return (
    <React.Fragment>
      {children}
      {!!children && <Spacer.Column numberOfSpaces={4} />}
      <StyledCaption>{expirationDateMessage}</StyledCaption>
    </React.Fragment>
  )
}

const StyledCaption = styled(Typo.CaptionNeutralInfo)({
  textAlign: 'center',
})
