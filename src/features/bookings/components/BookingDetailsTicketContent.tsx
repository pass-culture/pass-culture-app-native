import { t } from '@lingui/macro'
import { addDays, isSameDay } from 'date-fns'
import * as React from 'react'
import { Platform } from 'react-native'
import { openInbox } from 'react-native-email-link'
import QRCode from 'react-native-qrcode-svg'
import styled from 'styled-components/native'

import { CategoryIdEnum, BookingOfferResponse, BookingReponse } from 'api/gen'
import { TicketCode } from 'features/bookings/atoms/TicketCode'
import { OFFER_WITHDRAWAL_TYPE_OPTIONS } from 'features/bookings/components/types'
import { getBookingProperties } from 'features/bookings/helpers'
import { openUrl } from 'features/navigation/helpers'
import { useCategoryId, useSubcategory } from 'libs/subcategories'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'
import { BicolorEmailSent as InitialBicolorEmailSent } from 'ui/svg/icons/BicolorEmailSent'
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
      isExternal
      externalHref={offer.url || undefined}
      onPress={accessExternalOffer}
    />
  )

  const isDigitalAndActivationCodeEnabled =
    activationCodeFeatureEnabled && properties.hasActivationCode

  const collectType = booking?.stock?.offer?.withdrawalType || ''

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
            {collectType !== OFFER_WITHDRAWAL_TYPE_OPTIONS.BY_EMAIL && (
              <TicketCode code={booking.token} />
            )}
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

export const formatCollectDelayString = (delay: number) => {
  if (delay > 0 && delay <= 1800) {
    const delayInMinutes = delay / 60
    return t`${delayInMinutes} minutes`
  }

  const delayInHour = delay / 60 / 60
  if (delay === 3600) {
    return t`${delayInHour} heure`
  }

  if (delay <= 172800) {
    return t`${delayInHour} heures`
  }

  const delayInDay = delay / 60 / 60 / 24
  if (delay <= 518400) {
    return t`${delayInDay} jours`
  }

  const delayInWeek = delay / 60 / 60 / 24 / 7
  return t`${delayInWeek} semaine`
}

const TicketEmailSent = ({ offerDate }: TicketEmailSentProps) => {
  const emailMessage = isSameDay(offerDate, new Date())
    ? t`C'est aujourd'hui\u00a0!` +
      '\n' +
      t`Tu as dû recevoir ton billet par e-mail. Pense à vérifier tes spams.`
    : t`Ton billet t'a été envoyé par e-mail. Pense à vérifier tes spams`

  return (
    <TicketEmail testID="collect-info-email">
      <TicketInfo>{emailMessage}</TicketInfo>
      {Platform.OS !== 'web' && (
        <ButtonWithLinearGradient wording="Consulter mes e-mails" onPress={openInbox} isEmail />
      )}
    </TicketEmail>
  )
}

const TicketBody = ({ booking, proDisableEventsQrcode }: TicketBodyProps) => {
  const collectType = booking?.stock?.offer?.withdrawalType
  const collectDelay = booking?.stock?.offer?.withdrawalDelay || 0

  if (booking.qrCodeData && !proDisableEventsQrcode)
    return <QrCodeView qrCodeData={booking.qrCodeData} />

  if (
    collectType === OFFER_WITHDRAWAL_TYPE_OPTIONS.ON_SITE ||
    collectType === OFFER_WITHDRAWAL_TYPE_OPTIONS.BY_EMAIL
  ) {
    const startOffer = booking.stock.beginningDatetime

    if (startOffer && collectType === OFFER_WITHDRAWAL_TYPE_OPTIONS.BY_EMAIL) {
      // Calculation approximate date send e-mail
      const nbDays = collectDelay / 60 / 60 / 24
      const dateSendEmail = addDays(new Date(startOffer), -nbDays)
      const today = new Date()
      const startOfferDate = new Date(startOffer)

      if (isSameDay(startOfferDate, today) || today > dateSendEmail) {
        return <TicketEmailSent offerDate={startOfferDate} />
      }
    }

    const startMessage =
      (collectType === OFFER_WITHDRAWAL_TYPE_OPTIONS.ON_SITE
        ? t`présente le code ci-dessus sur place`
        : t`Tu vas recevoir ton billet par e-mail`) + ' '
    const delayMessage = collectDelay > 0 ? `${formatCollectDelayString(collectDelay)} ` : null
    const endMessage = t`avant le début de l’événement`

    return (
      <React.Fragment>
        {collectType === OFFER_WITHDRAWAL_TYPE_OPTIONS.BY_EMAIL && (
          <BicolorEmailSentContainer>
            <BicolorEmailSent />
          </BicolorEmailSentContainer>
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
})

const TicketInnerContent = styled.View({
  paddingTop: getSpacing(6),
  paddingHorizontal: getSpacing(5),
})

const TicketInfo = styled(Typo.Body)({
  textAlign: 'center',
  maxWidth: '100%',
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
  justifyContent: 'center',
  minHeight: theme.ticket.minHeight,
  width: '100%',
}))

const TicketEmail = styled.View({
  width: '100%',
})

const BicolorEmailSentContainer = styled.View({
  alignItems: 'center',
  width: '100%',
  marginBottom: getSpacing(6),
})

const BicolorEmailSent = styled(InitialBicolorEmailSent).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.medium,
  color: theme.colors.primary,
  color2: theme.colors.secondary,
}))``
