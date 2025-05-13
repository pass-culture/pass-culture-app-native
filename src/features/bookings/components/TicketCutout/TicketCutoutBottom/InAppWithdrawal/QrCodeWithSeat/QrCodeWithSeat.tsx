import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { QrCode } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/QrCode'
import { BarCode } from 'ui/svg/icons/BarCode'
import { getSpacing, Typo } from 'ui/theme'

export type QrCodeWithSeatProps = {
  seatIndex?: string
  seat?: string
  barcode: string
  children?: never
  shouldQrCodeBeHidden?: boolean
}

const QR_CODE_SIZE = getSpacing(50)

export const QrCodeWithSeat: FunctionComponent<QrCodeWithSeatProps> = ({
  seatIndex,
  seat,
  barcode,
  shouldQrCodeBeHidden,
}) => {
  const currentSeatWithIndex = seatIndex ? `Place\u00a0${seatIndex}\u00a0: ` : ''
  const currentSeat = seat ? `Siège\u00a0${seat?.toUpperCase()}` : ''
  return (
    <React.Fragment>
      <SeatContainer>
        {seatIndex ? <Typo.BodyAccentXs>{currentSeatWithIndex}</Typo.BodyAccentXs> : null}
        {seat ? <Typo.BodyAccentXs>{currentSeat}</Typo.BodyAccentXs> : null}
      </SeatContainer>
      {shouldQrCodeBeHidden ? (
        <DashedContainer testID="dashed-container-hiden-qrCode">
          <BarCode />
        </DashedContainer>
      ) : (
        <QrCode qrCode={barcode} />
      )}
    </React.Fragment>
  )
}

const SeatContainer = styled.View({
  textAlign: 'center',
  maxWidth: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
})

const DashedContainer = styled.View(({ theme }) => ({
  borderWidth: 2,
  borderColor: theme.colors.greySemiDark,
  borderRadius: 8,
  borderStyle: 'dashed',
  alignSelf: 'center',
  width: QR_CODE_SIZE,
  height: QR_CODE_SIZE,
  alignItems: 'center',
  justifyContent: 'center',
}))
