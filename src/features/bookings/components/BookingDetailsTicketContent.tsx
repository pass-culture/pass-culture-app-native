import { t } from '@lingui/macro'
import * as React from 'react'
import { Platform, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import styled from 'styled-components/native'

import { CategoryNameEnum, BookingOfferResponse, BookingReponse } from 'api/gen'
import {
  TICKET_MIN_HEIGHT,
  QR_CODE_SIZE,
} from 'features/bookings/components/ThreeShapesTicket.constants'
import { getBookingProperties } from 'features/bookings/helpers'
import { openExternalUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface BookingDetailsTicketContentProps {
  booking: BookingReponse
  activationCodeFeatureEnabled?: boolean
}

export const BookingDetailsTicketContent = (props: BookingDetailsTicketContentProps) => {
  const { booking, activationCodeFeatureEnabled } = props
  const offer = booking.stock.offer
  const properties = getBookingProperties(booking)

  const accessExternalOffer = () => {
    if (offer.url) {
      analytics.logAccessExternalOffer(offer.id)
      openExternalUrl(offer.url)
    }
  }

  const accessOfferButton = (
    <InnerButtonContainer>
      <ButtonPrimary title={t`Accéder à l'offre`} onPress={accessExternalOffer} />
    </InnerButtonContainer>
  )

  const isDigitalAndActivationCodeEnabled =
    activationCodeFeatureEnabled && properties.hasActivationCode

  return (
    <TicketContent>
      <Title>{offer.name}</Title>
      <TicketInnerContent>
        {isDigitalAndActivationCodeEnabled ? (
          <React.Fragment>
            <Token>{booking.activationCode?.code}</Token>
            {accessOfferButton}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Token>{booking.token}</Token>
            {properties.isDigital ? (
              accessOfferButton
            ) : booking.qrCodeData ? (
              <QrCodeView qrCodeData={booking.qrCodeData} />
            ) : null}
            <Ean offer={offer} />
          </React.Fragment>
        )}
      </TicketInnerContent>
    </TicketContent>
  )
}

type EanProps = {
  offer: BookingOfferResponse
}
const Ean = ({ offer }: EanProps) => {
  const shouldDisplayEAN = offer.extraData?.isbn && offer.category.name === CategoryNameEnum.LIVRE
  return shouldDisplayEAN ? (
    <EANContainer>
      <Typo.Caption>{t`EAN` + '\u00a0'}</Typo.Caption>
      <Typo.Body color={ColorsEnum.GREY_DARK}>{offer.extraData?.isbn}</Typo.Body>
    </EANContainer>
  ) : null
}

type QrCodeViewProps = {
  qrCodeData: string
}
const QrCodeView = ({ qrCodeData }: QrCodeViewProps) => {
  return (
    <View testID="qr-code">
      <QRCode value={qrCodeData} size={QR_CODE_SIZE} />
    </View>
  )
}

const TicketContent = styled.View({
  paddingHorizontal: getSpacing(7),
  paddingVertical: getSpacing(2),
  alignItems: 'center',
  minHeight: TICKET_MIN_HEIGHT,
  // Improve Web spacings using non default View boxSizing
  ...(Platform.OS === 'web' ? { boxSizing: 'content-box' } : {}),
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
