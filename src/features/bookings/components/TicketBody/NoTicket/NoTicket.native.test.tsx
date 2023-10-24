import React from 'react'

import { NoTicket } from 'features/bookings/components/TicketBody/NoTicket/NoTicket'
import { render, screen } from 'tests/utils'

describe('<NoTicket/>', () => {
  it('should render correctly', () => {
    render(<NoTicket />)

    expect(screen).toMatchSnapshot()
  })
})
