import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { QrCode } from 'features/bookings/components/TicketBody/QrCode/QrCode'
import { getSpacing, Typo } from 'ui/theme'

export type QrCodeWithSeatProps = {
  seatIndex?: string
  seat?: string
  barcode: string
  children?: never
}

export const QrCodeWithSeat: FunctionComponent<
  QrCodeWithSeatProps & { barCodeInfo: React.JSX.Element | null }
> = ({ seatIndex, seat, barcode, barCodeInfo }) => {
  const currentSeatWithIndex = seatIndex ? `Place\u00a0${seatIndex}\u00a0: ` : ''
  const currentSeat = seat ? `Siège\u00a0${seat?.toUpperCase()}` : ''
  return (
    <React.Fragment>
      <SeatContainer>
        {seatIndex ? <Typo.BodyAccentXs>{currentSeatWithIndex}</Typo.BodyAccentXs> : null}
        {seat ? <Seat>{currentSeat}</Seat> : null}
      </SeatContainer>
      <QrCode qrCode={barcode} />
      {barCodeInfo}
    </React.Fragment>
  )
}

const SeatContainer = styled(Typo.Body)({
  textAlign: 'center',
  maxWidth: '100%',
  paddingHorizontal: getSpacing(2),
  marginBottom: getSpacing(3),
})

const Seat = styled(Typo.Body)({
  marginLeft: getSpacing(1),
})
