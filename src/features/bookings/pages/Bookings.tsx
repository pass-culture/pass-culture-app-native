import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { useBookings } from '../api'
import { NoBookingsView } from '../components/NoBookingsView'

export const Bookings: React.FC = () => {
  const { data: bookings } = useBookings()

  const onGoingBookingsCount = bookings?.ongoing_bookings?.length || 0
  const bookingsCountLabel =
    `${onGoingBookingsCount}\u00a0` + getBookingsCountLabel(onGoingBookingsCount > 1)

  return (
    <React.Fragment>
      <SvgPageHeader title="Mes réservations" />
      <Container>
        {onGoingBookingsCount > 0 ? (
          <React.Fragment>
            <BookingsCount>{bookingsCountLabel}</BookingsCount>
            <Spacer.Flex />
          </React.Fragment>
        ) : (
          <NoBookingsView />
        )}
      </Container>
    </React.Fragment>
  )
}

const getBookingsCountLabel = (plural: boolean) =>
  plural ? _(t`réservations en cours`) : _(t`réservation en cours`)

const Container = styled.View({
  flex: 1,
  padding: getSpacing(4),
})

const BookingsCount = styled(Typo.Body).attrs({
  color: ColorsEnum.GREY_DARK,
})({
  fontSize: 15,
  paddingVertical: getSpacing(2),
})
