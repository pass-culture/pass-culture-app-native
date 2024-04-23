import React from 'react'

import { TicketWithContent } from 'features/bookings/components/Ticket/TicketWithContent'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { render, screen } from 'tests/utils'

const booking = bookingsSnap.ongoing_bookings[1]

describe('<TicketWithContent/>', () => {
  it('should render properly', () => {
    render(<TicketWithContent booking={booking} />)

    expect(screen).toMatchSnapshot()
  })
})
