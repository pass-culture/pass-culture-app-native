import React from 'react'

import { QrCode } from 'features/bookings/components/TicketBody/QrCode/QrCode'
import { render, screen } from 'tests/utils'

describe('<QrCode/>', () => {
  it('should render correctly', () => {
    render(<QrCode qrCode="PASSCULTURE:v3;TOKEN:352UW4" />)
    expect(screen).toMatchSnapshot()
  })
})
