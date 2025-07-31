import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { QrCode } from 'features/bookings/components/OldBookingDetails/TicketBody/QrCode/QrCode'
import { Typo } from 'ui/theme'

export type QrCodeWithSeatProps = {
  seatIndex?: string
  seat?: string
  barcode: string
  children?: never
}

export const QrCodeWithSeat: FunctionComponent<QrCodeWithSeatProps> = ({
  seatIndex,
  seat,
  barcode,
}) => {
  const currentSeatWithIndex = seatIndex ? `Place\u00a0${seatIndex}\u00a0: ` : ''
  const currentSeat = seat ? `Siège\u00a0${seat?.toUpperCase()}` : ''
  return (
    <React.Fragment>
      <SeatContainer>
        {seatIndex ? <Typo.BodyAccentXs>{currentSeatWithIndex}</Typo.BodyAccentXs> : null}
        {seat ? <Seat>{currentSeat}</Seat> : null}
      </SeatContainer>
      <QrCode qrCode={barcode} />
    </React.Fragment>
  )
}

const SeatContainer = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  maxWidth: '100%',
  paddingHorizontal: theme.designSystem.size.spacing.s,
  marginBottom: theme.designSystem.size.spacing.m,
}))

const Seat = styled(Typo.Body)(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.xs,
}))
