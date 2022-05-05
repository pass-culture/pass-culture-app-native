import React from 'react'

import { bookingsSnap } from 'features/bookings/api/bookingsSnap'
import { SwiperTickets } from 'features/bookings/components/SwiperTickets/SwiperTickets'
import { render } from 'tests/utils/web'

const booking = [
  bookingsSnap.ongoing_bookings[1],
  bookingsSnap.ongoing_bookings[1],
  bookingsSnap.ongoing_bookings[1],
  bookingsSnap.ongoing_bookings[1],
]

// TODO(LucasBeneston): remove this
// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

describe('<SwiperTickets/>', () => {
  it('should render properly', () => {
    const renderAPI = render(<SwiperTickets booking={booking} />)
    expect(renderAPI).toMatchSnapshot()
  })
})
