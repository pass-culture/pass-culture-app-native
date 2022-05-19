import React from 'react'

import { QrCode } from 'features/bookings/components/TicketBody/QrCode/QrCode'
import { render } from 'tests/utils'

describe('<QrCode/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<QrCode qrCode="PASSCULTURE:v3;TOKEN:352UW4" />)
    expect(renderAPI).toMatchSnapshot()
  })
})
