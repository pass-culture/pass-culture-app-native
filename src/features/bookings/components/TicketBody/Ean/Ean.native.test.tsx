import React from 'react'

import { Ean } from 'features/bookings/components/TicketBody/Ean/Ean'
import { render } from 'tests/utils'

describe('<Ean/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<Ean ean="123456789" />)
    expect(renderAPI).toMatchSnapshot()
  })
})
