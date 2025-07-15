import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { ExternalBookingDataResponseV2 } from 'api/gen'
import { getHiddenQRCodeTextInfos } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket/getHiddenQRCodeTextInfos'
import { TicketSwiper } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket/TicketSwiper'
import { TicketText } from 'features/bookings/components/Ticket/TicketBottomPart/TicketText'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import genericQrCode from 'ui/images/generic-qr-code.png'
import { BarCode } from 'ui/svg/icons/BarCode'
import { getSpacing } from 'ui/theme'

type props = {
  data?: ExternalBookingDataResponseV2[]
  beginningDatetime: string | undefined
  timezone?: string
  isDuo: boolean
}

export const ExternalBookingTicket = ({ data, beginningDatetime, timezone, isDuo }: props) => {
  const { day, time } = getHiddenQRCodeTextInfos(beginningDatetime, 48, timezone)
  const hiddenTicketText = `${isDuo ? 'Tes billets seront disponibles' : 'Ton billet sera disponible'} ici le ${day} à ${time}`
  const visibleTicketText = `Présente ${isDuo ? 'ces billets' : 'ce billet'} pour accéder à l’évènement.`

  return (
    <StyledViewGap gap={4} testID="external-booking-ticket-container">
      {data?.length ? (
        <React.Fragment>
          <TicketSwiper data={data} />
          <TicketText>{visibleTicketText}</TicketText>
        </React.Fragment>
      ) : (
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
      )}
    </StyledViewGap>
  )
}

const StyledViewGap = styled(ViewGap)({
  justifyContent: 'center',
  minHeight: getSpacing(25),
  width: '100%',
})

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
  borderRadius: 8,
  borderStyle: 'dashed',
  alignSelf: 'center',
}))
