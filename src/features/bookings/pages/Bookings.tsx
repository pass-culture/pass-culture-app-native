import React from 'react'
import styled from 'styled-components/native'

import { OnGoingBookingsList } from 'features/bookings/components/OnGoingBookingsList'
import { PageTitle } from 'ui/components/PageTitle'

export function Bookings() {
  return (
    <Container>
      <PageTitle title="Mes réservations" />
      <OnGoingBookingsList />
    </Container>
  )
}

const Container = styled.View({ flex: 1 })
