import React from 'react'
import styled from 'styled-components/native'

import { SwipperTickets } from 'features/bookings/components/SwipperTickets'

const tickets = [{ title: 'Ticket 1' }, { title: 'Ticket 2' }, { title: 'Ticket 3' }]

export function SwipperTicketPageTest() {
  return (
    <Container>
      <SwipperTickets tickets={tickets} />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})
