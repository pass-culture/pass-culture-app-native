import { t } from '@lingui/macro'
import * as React from 'react'
import { View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import styled from 'styled-components/native'

import { CategoryNameEnum, BookingOfferResponse, BookingReponse } from 'api/gen'
import { TICKET_MIN_HEIGHT } from 'features/bookings/components/ThreeShapesTicket'
import { getBookingProperties } from 'features/bookings/helpers'
import { openExternalUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface BookingDetailsTicketContentProps {
  offer: BookingOfferResponse
  booking: BookingReponse
}

export const BookingDetailsTicketContent = (props: BookingDetailsTicketContentProps) => {
  const { offer, booking } = props
  const shouldDisplayEAN = offer.extraData?.isbn && offer.category.name === CategoryNameEnum.LIVRE
  const properties = getBookingProperties(booking)

  const accessExternalOffer = () => {
    if (offer.url) {
      analytics.logAccessExternalOffer(offer.id)
      openExternalUrl(offer.url)
    }
  }

  return (
    <TicketContent>
      <Title>{offer.name}</Title>
      <TicketInnerContent>
        <Token>{booking.token}</Token>
        {properties.isDigital ? (
          <InnerButtonContainer>
            <ButtonPrimary title={t`Accéder à l'offre`} onPress={accessExternalOffer} />
          </InnerButtonContainer>
        ) : booking.qrCodeData ? (
          <View testID="qr-code">
            <QRCode value={booking.qrCodeData} size={QR_CODE_SIZE} />
          </View>
        ) : null}
        {shouldDisplayEAN && (
          <EANContainer>
            <Typo.Caption>{t`EAN` + '\u00a0'}</Typo.Caption>
            <Typo.Body color={ColorsEnum.GREY_DARK}>{offer.extraData?.isbn}</Typo.Body>
          </EANContainer>
        )}
      </TicketInnerContent>
    </TicketContent>
  )
}
const QR_CODE_SIZE = 170

const TicketContent = styled.View({
  paddingHorizontal: getSpacing(7),
  paddingVertical: getSpacing(2),
  alignItems: 'center',
  minHeight: TICKET_MIN_HEIGHT,
})

const Title = styled(Typo.Title3)({
  paddingHorizontal: getSpacing(1),
  textAlign: 'center',
})

const Token = styled(Typo.Title4)({
  color: ColorsEnum.PRIMARY,
  textAlign: 'center',
  padding: getSpacing(2.5),
})

const TicketInnerContent = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
})

const InnerButtonContainer = styled.View({
  flexDirection: 'row',
})

const EANContainer = styled.View({
  paddingTop: getSpacing(2.5),
  flexDirection: 'row',
  alignItems: 'center',
})
