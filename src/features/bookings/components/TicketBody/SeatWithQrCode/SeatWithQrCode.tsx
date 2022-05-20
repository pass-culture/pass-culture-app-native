import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { QrCode } from 'features/bookings/components/TicketBody/QrCode/QrCode'
import { getSpacing, Typo } from 'ui/theme'

export type SeatWithQrCodeProps = {
  seatIndex?: string
  seat?: string
  barcode: string
  children?: never
}

const whiteSpace = ' '
export const SeatWithQrCode: FunctionComponent<SeatWithQrCodeProps> = ({
  seatIndex,
  seat,
  barcode,
}) => {
  const currentSeatWithIndex = t({
    id: 'siège avec nombre de sièges',
    values: { seat: seatIndex },
    message: 'Place\u00a0{seat}\u00a0:',
  })
  const currentSeat = t({
    id: 'siège',
    values: { seat: seat?.toUpperCase() },
    message: 'Siège\u00a0{seat}',
  })
  return (
    <React.Fragment>
      <SeatContainer>
        {!!seatIndex && (
          <Typo.Caption>
            {currentSeatWithIndex}
            {whiteSpace}
          </Typo.Caption>
        )}
        {!!seat && <Seat>{currentSeat}</Seat>}
      </SeatContainer>
      <QrCode qrCode={barcode} />
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
