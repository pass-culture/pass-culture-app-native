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
  proDisableEventsQrcode?: boolean
}

export const BookingDetailsTicketContent = (props: BookingDetailsTicketContentProps) => {
  const { booking, activationCodeFeatureEnabled, proDisableEventsQrcode } = props
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
    <TicketContainer>
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
            ) : (
              <TicketBody booking={booking} proDisableEventsQrcode={!!proDisableEventsQrcode} />
            )}
          </React.Fragment>
        )}
      </TicketInnerContent>
      {!!shouldDisplayEAN && <Ean offer={offer} />}
    </TicketContainer>
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

type TicketBodyProps = {
  booking: BookingReponse
  proDisableEventsQrcode: boolean
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

const formatCollectDelayString = (delay: number) => {
  if (delay > 0 && delay <= 1800) {
    const delayInMinutes = delay / 60
    return t`${delayInMinutes} minutes`
  }

  const delayInHour = delay / 60 / 60
  if (delay === 3600) {
    return t`${delayInHour} heure`
  }
  return t`${delayInHour} heures`
}

const TicketBody = ({ booking, proDisableEventsQrcode }: TicketBodyProps) => {
  const collectType = booking?.stock?.offer?.withdrawalType
  const collectDelay = booking?.stock?.offer?.withdrawalDelay || 0

  if (booking.qrCodeData && !proDisableEventsQrcode)
    return <QrCodeView qrCodeData={booking.qrCodeData} />

  if (collectType === 'on_site') {
    const startMessage = t`présente le code ci-dessus sur place` + ' '
    const delayMessage = collectDelay > 0 ? `${formatCollectDelayString(collectDelay)} ` : null
    const endMessage = t`avant le début de l’événement`

    return (
      <TicketInfo testID="collect-info">
        {startMessage}
        {!!delayMessage && (
          <TicketCollectDelay testID="collect-info-delay">{delayMessage}</TicketCollectDelay>
        )}
        {endMessage}
      </TicketInfo>
    )
  }

  return null
}

const DarkGreyCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const Title = styled(Typo.Title3).attrs(getHeadingAttrs(1))({
  textAlign: 'center',
  maxWidth: '100%',
})

const TicketInnerContent = styled.View({
  paddingTop: getSpacing(6),
})

const TicketInfo = styled(Typo.Body).attrs(getHeadingAttrs(1))({
  textAlign: 'center',
  maxWidth: '100%',
  paddingHorizontal: getSpacing(5),
  paddingBottom: getSpacing(6),
})

const TicketCollectDelay = styled(Typo.Body)(({ theme }) => ({
  fontFamily: theme.fontFamily.bold,
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

const TicketContainer = styled.View(({ theme }) => ({
  minHeight: theme.ticket.minHeight,
}))

const StyledA = webStyled(A)({
  display: 'flex',
  flexDirection: 'column',
})
