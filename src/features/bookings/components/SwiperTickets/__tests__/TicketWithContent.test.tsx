import React from 'react'

import { bookingsWithExternalBookingInformationsSnap } from 'features/bookings/api/bookingsSnapWithExternalBookingInformations'
import { TicketWithContent } from 'features/bookings/components/SwiperTickets/TicketWithContent'
import { render } from 'tests/utils'

const booking = bookingsWithExternalBookingInformationsSnap.ongoing_bookings[0]

describe('<TicketWithContent/>', () => {
  it('should render properly', () => {
    const renderAPI = render(<TicketWithContent booking={booking} />)
    expect(renderAPI).toMatchSnapshot()
  })
})
