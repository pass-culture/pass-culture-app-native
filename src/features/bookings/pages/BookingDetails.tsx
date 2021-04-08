import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React, { useRef } from 'react'
import { Animated, Dimensions, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import QRCode from 'react-native-qrcode-svg'
import styled from 'styled-components/native'

import { CategoryNameEnum } from 'api/gen'
import { useOngoingBooking } from 'features/bookings/api/queries'
import { BookingDetailsHeader } from 'features/bookings/components/BookingDetailsHeader'
import { BookingPropertiesSection } from 'features/bookings/components/BookingPropertiesSection'
import { ThreeShapesTicket } from 'features/bookings/components/ThreeShapesTicket'
import { getBookingProperties } from 'features/bookings/helpers'
import { openExternalUrl } from 'features/navigation/helpers'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { interpolationConfig } from 'ui/components/headers/animationHelpers'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

const HEADER_TICKET_MAX_WIDTH = 304
const HEADER_TICKET_WIDTH = Dimensions.get('screen').width - getSpacing(15)
const QR_CODE_SIZE = 170

export function BookingDetails() {
  const { params } = useRoute<UseRouteType<'BookingDetails'>>()
  const booking = useOngoingBooking(params.id)
  const headerScroll = useRef(new Animated.Value(0)).current

  if (!booking) return <React.Fragment></React.Fragment>

  const headerTransition = headerScroll.interpolate(interpolationConfig)
  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: headerScroll } } }], {
    useNativeDriver: false,
  })

  const properties = getBookingProperties(booking)

  const { offer } = booking.stock
  const shouldDisplayEAN = offer.extraData?.isbn && offer.category.name === CategoryNameEnum.LIVRE

  const renderOfferRules = properties.isDigital ? (
    <OfferRules>
      {t`Ce code à 6 caractères est ta preuve d’achat ! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.`}
    </OfferRules>
  ) : properties.isPhysical || properties.isEvent ? (
    <OfferRules>
      {t`Tu dois présenter ta carte d’identité et ce code de 6 caractères pour profiter de ta réservation ! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.`}
    </OfferRules>
  ) : (
    ''
  )

  return (
    <React.Fragment>
      <BookingDetailsHeader headerTransition={headerTransition} title={offer.name} />
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={10}
        scrollIndicatorInsets={{ right: 1 }}
        bounces={false}>
        <Spacer.Column numberOfSpaces={8.5} />
        <DetailedBookingTicket>
          {/* FIXME(PC-7474) change color when add background */}
          <ThreeShapesTicket
            width={Math.min(HEADER_TICKET_WIDTH, HEADER_TICKET_MAX_WIDTH)}
            color={ColorsEnum.GREY_LIGHT}>
            <TicketContent>
              <Title numberOfLines={3}>{offer.name}</Title>
              <Spacer.Column numberOfSpaces={properties.isDigital ? 8 : 3} />
              <Token>{booking.token}</Token>
              <Spacer.Column numberOfSpaces={2.5} />

              {properties.isDigital ? (
                <React.Fragment>
                  <ButtonPrimary
                    title={t`Accéder à l'offre`}
                    onPress={() => offer.url && openExternalUrl(offer.url)}
                  />
                  <Spacer.Column numberOfSpaces={9} />
                </React.Fragment>
              ) : booking.qrCodeData ? (
                <View testID="qr-code">
                  <QRCode value={booking.qrCodeData} size={QR_CODE_SIZE} />
                </View>
              ) : null}
              {shouldDisplayEAN && (
                <EANContainer>
                  <Typo.Caption>{t`EAN\u00a0`}</Typo.Caption>
                  <Typo.Body color={ColorsEnum.GREY_DARK}>{offer.extraData?.isbn}</Typo.Body>
                </EANContainer>
              )}
            </TicketContent>
          </ThreeShapesTicket>
        </DetailedBookingTicket>
        <Spacer.Column numberOfSpaces={4} />
        {renderOfferRules}
        <Spacer.Column numberOfSpaces={8} />
        <BookingPropertiesSection booking={booking} />
        {/* FIXME(PC-7477) add itinerary button and remove this space */}
        <Spacer.Column numberOfSpaces={50} />
      </ScrollView>
    </React.Fragment>
  )
}

const OfferRules = styled(Typo.Caption)({
  color: ColorsEnum.GREY_MEDIUM,
  textAlign: 'center',
  paddingHorizontal: getSpacing(6),
})

const DetailedBookingTicket = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
})

const TicketContent = styled.View({
  flexDirection: 'column',
  paddingHorizontal: getSpacing(7),
  paddingVertical: getSpacing(2),
  alignItems: 'center',
})

const Title = styled(Typo.Title3)({
  paddingHorizontal: getSpacing(1),
  textAlign: 'center',
})

const Token = styled(Typo.Title4)({
  color: ColorsEnum.PRIMARY,
  textAlign: 'center',
})

const EANContainer = styled.View({
  paddingTop: getSpacing(2.5),
  flexDirection: 'row',
  alignItems: 'center',
})
