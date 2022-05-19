import React from 'react'

import { NoTicket } from 'features/bookings/components/TicketBody/NoTicket/NoTicket'
import { render } from 'tests/utils'

describe('<NoTicket/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<NoTicket />)
    expect(renderAPI).toMatchSnapshot()
  })
})
