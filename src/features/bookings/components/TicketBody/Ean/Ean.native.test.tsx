import React from 'react'

import { Ean } from 'features/bookings/components/TicketBody/Ean/Ean'
import { render, screen } from 'tests/utils'

describe('<Ean/>', () => {
  it('should render correctly', () => {
    render(<Ean ean="123456789" />)

    expect(screen).toMatchSnapshot()
  })
})
