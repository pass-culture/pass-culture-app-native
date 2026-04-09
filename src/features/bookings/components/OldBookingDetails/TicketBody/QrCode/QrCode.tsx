import React, { FunctionComponent } from 'react'
import QRCode from 'react-native-qrcode-svg'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

const QR_CODE_SIZE = getSpacing(40)

type Props = {
  qrCode: string
  children?: never
}

export const QrCode: FunctionComponent<Props> = ({ qrCode }) => (
  <QrCodeContainer testID="qr-code">
    <StyledQRCode value={qrCode} />
  </QrCodeContainer>
)

const QrCodeContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  alignSelf: 'center',
  backgroundColor: theme.designSystem.color.background.locked,
  padding: theme.designSystem.size.spacing.s,
  borderRadius: theme.designSystem.size.borderRadius.m,
  borderWidth: 2,
  borderColor: theme.designSystem.color.border.subtle,
}))

const StyledQRCode = styled(QRCode).attrs({
  size: QR_CODE_SIZE,
  quietZone: 0,
})``
