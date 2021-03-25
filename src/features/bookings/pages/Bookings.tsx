import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'

import { useBookings } from '../api'
import { OnGoingBookingsList } from '../components/OnGoingBookingsList'

export const Bookings: React.FC = () => {
  const { data: bookings } = useBookings()
  return (
    <Container>
      <SvgPageHeader title="Mes réservations" />
      <OnGoingBookingsList
        bookings={bookings?.ongoing_bookings}
        endedBookings={bookings?.ended_bookings}
      />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
})
