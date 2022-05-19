import React from 'react'

import { bookingsSnap } from 'features/bookings/api/bookingsSnap'
import { Ean } from 'features/bookings/components/TicketBody/Ean/Ean'
import { render } from 'tests/utils'

const offer = bookingsSnap.ongoing_bookings[0].stock.offer

describe('<Ean/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<Ean offer={offer} />)
    expect(renderAPI).toMatchSnapshot()
  })
})
