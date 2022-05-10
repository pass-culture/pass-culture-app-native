import React from 'react'

import { bookingsSnap } from 'features/bookings/api/bookingsSnap'
import { TicketWithContent } from 'features/bookings/components/SwiperTickets/TicketWithContent'
import { render } from 'tests/utils'

const booking = bookingsSnap.ongoing_bookings[1]

describe('<TicketWithContent/>', () => {
  it('should render properly', () => {
    const renderAPI = render(<TicketWithContent booking={booking} />)
    expect(renderAPI).toMatchSnapshot()
  })
})
