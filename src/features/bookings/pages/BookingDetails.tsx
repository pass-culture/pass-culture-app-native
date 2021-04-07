import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React, { useRef } from 'react'
import { Animated } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { useOngoingBooking } from 'features/bookings/api/queries'
import { BookingDetailsHeader } from 'features/bookings/components/BookingDetailsHeader'
import { BookingPropertiesSection } from 'features/bookings/components/BookingPropertiesSection'
import { ThreeShapesTicket } from 'features/bookings/components/ThreeShapesTicket'
import { getBookingProperties } from 'features/bookings/helpers'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { interpolationConfig } from 'ui/components/headers/animationHelpers'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

const HEADER_TICKET_WIDTH = 304

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

  return (
    <React.Fragment>
      <BookingDetailsHeader headerTransition={headerTransition} title={booking.stock.offer.name} />
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={10}
        scrollIndicatorInsets={{ right: 1 }}
        bounces={false}>
        <Spacer.Column numberOfSpaces={8.5} />
        <HeaderTicket>
          {/* FIXME(PC-7471) change color when add content to this component */}
          <ThreeShapesTicket width={HEADER_TICKET_WIDTH} color={ColorsEnum.GREY_LIGHT} />
        </HeaderTicket>
        <Spacer.Column numberOfSpaces={4} />
        {properties.isDigital && (
          <OfferRules>
            {_(t`Ce code à 6 caractères est ta preuve d’achat ! N’oublie pas que tu
            n’as pas le droit de le revendre ou le céder.`)}
          </OfferRules>
        )}
        {(properties.isPhysical || properties.isEvent) && (
          <OfferRules>
            {_(t`Tu dois présenter ta carte d’identité et ce code de 6 caractères pour
            profiter de ta réservation ! N’oublie pas que tu n’as pas le droit de le revendre ou le
            céder.`)}
          </OfferRules>
        )}
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

const HeaderTicket = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
})
