import { t } from '@lingui/macro'
import { useRoute } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { useOngoingBooking } from 'features/bookings/api/queries'
import { getBookingProperties } from 'features/bookings/helpers'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function BookingDetails() {
  const { params } = useRoute<UseRouteType<'BookingDetails'>>()
  const booking = useOngoingBooking(params.id)
  const properties = getBookingProperties(booking)

  return (
    <React.Fragment>
      <SvgPageHeader title="Page temporaire" />
      <Container>
        <Text>Réservation Id : {params.id}</Text>
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
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View({
  padding: getSpacing(6),
})

const OfferRules = styled(Typo.Caption)({
  color: ColorsEnum.GREY_MEDIUM,
  textAlign: 'center',
})
