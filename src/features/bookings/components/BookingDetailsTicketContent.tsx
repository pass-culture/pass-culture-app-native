import { t } from '@lingui/macro'
import { addDays, isSameDay } from 'date-fns'
import * as React from 'react'
import { Platform } from 'react-native'
import { openInbox } from 'react-native-email-link'
import QRCode from 'react-native-qrcode-svg'
import styled from 'styled-components/native'

import { CategoryIdEnum, BookingOfferResponse, BookingReponse } from 'api/gen'
import { WithdrawalTypeEnum } from 'api/gen'
import { TicketCode } from 'features/bookings/atoms/TicketCode'
import { formatSecondsToString, getBookingProperties } from 'features/bookings/helpers'
import { openUrl } from 'features/navigation/helpers'
import { useCategoryId, useSubcategory } from 'libs/subcategories'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'
import { BicolorCircledCheck as InitialBicolorCircledCheck } from 'ui/svg/icons/BicolorCircledCheck'
import { BicolorEmailSent as InitialBicolorEmailSent } from 'ui/svg/icons/BicolorEmailSent'
import { Email } from 'ui/svg/icons/Email'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'

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
    <ButtonWithLinearGradient
      wording={t`Accéder à l'offre`}
      icon={ExternalSite}
      externalHref={offer.url || undefined}
      onPress={accessExternalOffer}
    />
  )

  const isDigitalAndActivationCodeEnabled =
    activationCodeFeatureEnabled && properties.hasActivationCode

  const collectType = booking?.stock?.offer?.withdrawalType || undefined

  return (
    <TicketContainer>
      <Title>{offer.name}</Title>
      <Spacer.Column numberOfSpaces={2} />
      <TicketInnerContent>
        {isDigitalAndActivationCodeEnabled ? (
          <React.Fragment>
            {!!booking.activationCode && (
              <TicketCode collectType={collectType} code={booking.activationCode?.code} />
            )}
            {accessOfferButton}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <TicketCode collectType={collectType} code={booking.token} />
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

type TicketEmailSentProps = {
  offerDate: Date
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

const TicketEmailSent = ({ offerDate }: TicketEmailSentProps) => {
  const emailMessage = isSameDay(offerDate, new Date())
    ? t`C'est aujourd'hui\u00a0!` +
      '\n' +
      t`Tu as dû recevoir ton billet par e-mail. Pense à vérifier tes spams.`
    : t`Ton billet t'a été envoyé par e-mail. Pense à vérifier tes spams.`

  return (
    <Ticket testID="collect-info-email">
      <TicketInfo testID="collect-info-email-msg">{emailMessage}</TicketInfo>
      {Platform.OS !== 'web' && (
        <ButtonWithLinearGradient
          wording="Consulter mes e-mails"
          onPress={openInbox}
          testID="collect-info-email-btn"
          icon={Email}
        />
      )}
    </Ticket>
  )
}

const NoTicket = () => {
  const message = t`Tu n’as pas besoin de billet\u00a0! Rends toi directement sur place le jour de l’événement.`

  return (
    <Ticket testID="collect-info-no-ticket">
      <IconContainer>
        <BicolorCircledCheck />
      </IconContainer>
      <NoTicketInfo>{message}</NoTicketInfo>
    </Ticket>
  )
}

const TicketBody = ({ booking, proDisableEventsQrcode }: TicketBodyProps) => {
  const collectType = booking?.stock?.offer?.withdrawalType
  const collectDelay = booking?.stock?.offer?.withdrawalDelay || 0

  if (booking.qrCodeData && !proDisableEventsQrcode)
    return <QrCodeView qrCodeData={booking.qrCodeData} />

  if (collectType === WithdrawalTypeEnum.no_ticket) {
    return <NoTicket />
  }

  if (collectType === WithdrawalTypeEnum.on_site || collectType === WithdrawalTypeEnum.by_email) {
    const { beginningDatetime } = booking.stock

    if (beginningDatetime && collectType === WithdrawalTypeEnum.by_email) {
      // Calculation approximate date send e-mail
      const nbDays = collectDelay / 60 / 60 / 24
      const dateSendEmail = addDays(new Date(beginningDatetime), -nbDays)
      const today = new Date()
      const startOfferDate = new Date(beginningDatetime)

      if (isSameDay(startOfferDate, today) || today > dateSendEmail) {
        return <TicketEmailSent offerDate={startOfferDate} />
      }
    }

    const startMessage =
      (collectType === WithdrawalTypeEnum.on_site
        ? t`Présente le code ci-dessus sur place`
        : t`Tu vas recevoir ton billet par e-mail`) + ' '
    const delayMessage = collectDelay > 0 ? `${formatSecondsToString(collectDelay)} ` : null
    const endMessage = t`avant le début de l’événement.`

    return (
      <React.Fragment>
        {collectType === WithdrawalTypeEnum.by_email && (
          <IconContainer>
            <BicolorEmailSent />
          </IconContainer>
        )}

        <TicketInfo testID="collect-info">
          {startMessage}
          {!!delayMessage && (
            <TicketCollectDelay testID="collect-info-delay">{delayMessage}</TicketCollectDelay>
          )}
          {endMessage}
        </TicketInfo>
      </React.Fragment>
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
  paddingHorizontal: getSpacing(2),
})

const TicketInnerContent = styled.View({
  paddingTop: getSpacing(6),
  paddingHorizontal: getSpacing(2),
})

const TicketInfo = styled(Typo.Body)({
  textAlign: 'center',
  maxWidth: '100%',
  paddingBottom: getSpacing(6),
})

const NoTicketInfo = styled(Typo.Body)({
  textAlign: 'center',
  maxWidth: '100%',
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
  justifyContent: 'center',
  minHeight: theme.ticket.minHeight,
  width: '100%',
}))

const Ticket = styled.View({
  width: '100%',
})

const IconContainer = styled.View({
  alignItems: 'center',
  width: '100%',
  marginTop: -getSpacing(4),
  marginBottom: getSpacing(3),
})

const BicolorEmailSent = styled(InitialBicolorEmailSent).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.medium,
  color: theme.colors.primary,
  color2: theme.colors.secondary,
}))``

const BicolorCircledCheck = styled(InitialBicolorCircledCheck).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.medium,
  color: theme.colors.primary,
  color2: theme.colors.secondary,
}))``
