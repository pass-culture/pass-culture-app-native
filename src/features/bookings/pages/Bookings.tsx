import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import SvgPageHeader from 'ui/components/headers/SvgPageHeader'

import { useBookings } from '../api/queries'
import { OnGoingBookingsList } from '../components/OnGoingBookingsList'

export const Bookings: React.FC = () => {
  const { data: bookings } = useBookings()
  return (
    <Container>
      <SvgPageHeader title={t`Mes réservations`} />
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
