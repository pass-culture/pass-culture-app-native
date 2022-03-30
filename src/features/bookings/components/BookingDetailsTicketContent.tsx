import { t } from '@lingui/macro'
import * as React from 'react'
import QRCode from 'react-native-qrcode-svg'
import webStyled from 'styled-components'
import styled from 'styled-components/native'

import { CategoryIdEnum, BookingOfferResponse, BookingReponse } from 'api/gen'
import { TicketCode } from 'features/bookings/atoms/TicketCode'
import { getBookingProperties } from 'features/bookings/helpers'
import { openUrl } from 'features/navigation/helpers'
import { useCategoryId, useSubcategory } from 'libs/subcategories'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'
import { A } from 'ui/web/link/A'

interface BookingDetailsTicketContentProps {
  booking: BookingReponse
  activationCodeFeatureEnabled?: boolean
}

export const BookingDetailsTicketContent = (props: BookingDetailsTicketContentProps) => {
  const { booking, activationCodeFeatureEnabled } = props
  const offer = booking.stock.offer
  const { isEvent } = useSubcategory(offer.subcategoryId)
  const properties = getBookingProperties(booking, isEvent)

  const accessExternalOffer = () => {
    if (offer.url) {
      openUrl(offer.url, { analyticsData: { offerId: offer.id } })
    }
  }
  const categoryId = useCategoryId(offer.subcategoryId)
  const shouldDisplayEAN = offer.extraData?.isbn && categoryId === CategoryIdEnum.LIVRE

  const accessOfferButton = (
    <StyledA href={offer.url || undefined}>
      <ButtonWithLinearGradient
        wording={t`Accéder à l'offre`}
        isExternal
        onPress={accessExternalOffer}
      />
    </StyledA>
  )

  const isDigitalAndActivationCodeEnabled =
    activationCodeFeatureEnabled && properties.hasActivationCode

  return (
    <React.Fragment>
      <Title>{offer.name}</Title>
      <Spacer.Column numberOfSpaces={2} />
      <TicketInnerContent>
        {isDigitalAndActivationCodeEnabled ? (
          <React.Fragment>
            {!!booking.activationCode && <TicketCode code={booking.activationCode?.code} />}
            {accessOfferButton}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <TicketCode code={booking.token} />
            {properties.isDigital ? (
              accessOfferButton
            ) : booking.qrCodeData ? (
              <QrCodeView qrCodeData={booking.qrCodeData} />
            ) : null}
          </React.Fragment>
        )}
      </TicketInnerContent>
      {!!shouldDisplayEAN && <Ean offer={offer} />}
    </React.Fragment>
  )
}

type EanProps = {
  offer: BookingOfferResponse
}
const Ean = ({ offer }: EanProps) => (
  <EANContainer>
    <Typo.Caption>{t`EAN` + '\u00a0'}</Typo.Caption>
    <DarkGreyCaption>{offer.extraData?.isbn}</DarkGreyCaption>
  </EANContainer>
)

type QrCodeViewProps = {
  qrCodeData: string
}

const StyledQRCode = styled(QRCode).attrs<{ value: QrCodeViewProps }>(({ theme, value }) => ({
  value,
  size: theme.ticket.qrCodeSize,
}))``

const QrCodeView = ({ qrCodeData }: QrCodeViewProps) => (
  <QrCodeContainer testID="qr-code">
    <StyledQRCode value={qrCodeData} />
  </QrCodeContainer>
)

const DarkGreyCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const Title = styled(Typo.Title3).attrs(getHeadingAttrs(1))({
  textAlign: 'center',
  maxWidth: '100%',
})

const TicketInnerContent = styled.View(({ theme }) => ({
  justifyContent: 'center',
  paddingHorizontal: getSpacing(5),
  minHeight: theme.ticket.minHeight,
  width: '100%',
}))

const QrCodeContainer = styled.View({
  alignItems: 'center',
  marginBottom: getSpacing(3),
})

const EANContainer = styled.View({
  flexDirection: 'row',
  marginTop: getSpacing(3),
  alignItems: 'center',
  justifyContent: 'center',
})

const StyledA = webStyled(A)({
  display: 'flex',
  flexDirection: 'column',
})
