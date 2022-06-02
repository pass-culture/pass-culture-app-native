import React, { FunctionComponent } from 'react'
import QRCode from 'react-native-qrcode-svg'
import styled from 'styled-components/native'

type Props = {
  qrCode: string
  children?: never
}

export const QrCode: FunctionComponent<Props> = ({ qrCode }) => (
  <QrCodeContainer testID="qr-code">
    <StyledQRCode value={qrCode} />
  </QrCodeContainer>
)

const QrCodeContainer = styled.View({
  alignItems: 'center',
})

const StyledQRCode = styled(QRCode).attrs(({ theme }) => ({
  size: theme.ticket.qrCodeSize,
}))``
