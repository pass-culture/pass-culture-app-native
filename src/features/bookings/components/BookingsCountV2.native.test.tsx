import React from 'react'

import { BookingsCountV2 } from 'features/bookings/components/BookingsCountV2'
import { render, screen } from 'tests/utils'

jest.useFakeTimers()

describe('<BookingsCountV2 />', () => {
  it('should display booking icon with count', async () => {
    render(<BookingsCountV2 badgeValue={1} />)

    expect(await screen.findByText('1')).toBeOnTheScreen()
  })
})
