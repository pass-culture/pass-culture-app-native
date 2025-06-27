import React, { FunctionComponent } from 'react'
import QRCode from 'react-native-qrcode-svg'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

const QR_CODE_SIZE = getSpacing(50)

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

const StyledQRCode = styled(QRCode).attrs({
  size: QR_CODE_SIZE,
})``
