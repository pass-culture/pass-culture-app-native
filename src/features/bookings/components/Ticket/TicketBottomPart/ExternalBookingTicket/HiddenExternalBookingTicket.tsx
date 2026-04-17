import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { getHiddenQRCodeTextInfos } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket/getHiddenQRCodeTextInfos'
import { TicketText } from 'features/bookings/components/Ticket/TicketBottomPart/TicketText'
import genericQrCode from 'ui/images/generic-qr-code.png'
import { BarCode } from 'ui/svg/icons/BarCode'

type Props = {
  beginningDatetime: string | undefined
  timezone?: string
  isDuo: boolean
}

export const HiddenExternalBookingTicket = ({ beginningDatetime, timezone, isDuo }: Props) => {
  const { day, time } = getHiddenQRCodeTextInfos(beginningDatetime, 48, timezone)
  const hiddenTicketText = `${isDuo ? 'Tes billets seront disponibles' : 'Ton billet sera disponible'} ici le ${day} à ${time}`

  return (
    <React.Fragment>
      <DashedContainer>
        <BlurredQrCodeContainer>
          <BlurredQrCode />
          <ContentContainer>
            <BarCode />
          </ContentContainer>
        </BlurredQrCodeContainer>
      </DashedContainer>
      <TicketText>{hiddenTicketText}</TicketText>
    </React.Fragment>
  )
}

const BlurredQrCodeContainer = styled.View({
  position: 'relative',
})

const BlurredQrCode = styled.ImageBackground.attrs({
  blurRadius: Platform.OS === 'android' ? 15 : 4,
  source: genericQrCode,
})(({ theme }) => ({
  width: theme.ticket.qrCodeSize,
  height: theme.ticket.qrCodeSize,
  opacity: 0.1,
}))

const ContentContainer = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'space-evenly',
  alignItems: 'center',
})

const DashedContainer = styled.View(({ theme }) => ({
  borderWidth: 2,
  borderColor: theme.designSystem.color.border.default,
  borderRadius: theme.designSystem.size.borderRadius.m,
  borderStyle: 'dashed',
  alignSelf: 'center',
}))
