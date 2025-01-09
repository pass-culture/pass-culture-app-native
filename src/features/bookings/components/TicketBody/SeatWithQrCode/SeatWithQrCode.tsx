import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { QrCode } from 'features/bookings/components/TicketBody/QrCode/QrCode'
import { getSpacing, TypoDS } from 'ui/theme'

export type SeatWithQrCodeProps = {
  seatIndex?: string
  seat?: string
  barcode: string
  children?: never
}

export const SeatWithQrCode: FunctionComponent<SeatWithQrCodeProps> = ({
  seatIndex,
  seat,
  barcode,
}) => {
  const currentSeatWithIndex = seatIndex ? `Place\u00a0${seatIndex}\u00a0: ` : ''
  const currentSeat = seat ? `Siège\u00a0${seat?.toUpperCase()}` : ''
  return (
    <React.Fragment>
      <SeatContainer>
        {seatIndex ? <TypoDS.BodyAccentXs>{currentSeatWithIndex}</TypoDS.BodyAccentXs> : null}
        {seat ? <Seat>{currentSeat}</Seat> : null}
      </SeatContainer>
      <QrCode qrCode={barcode} />
    </React.Fragment>
  )
}

const SeatContainer = styled(TypoDS.Body)({
  textAlign: 'center',
  maxWidth: '100%',
  paddingHorizontal: getSpacing(2),
  marginBottom: getSpacing(3),
})

const Seat = styled(TypoDS.Body)({
  marginLeft: getSpacing(1),
})
