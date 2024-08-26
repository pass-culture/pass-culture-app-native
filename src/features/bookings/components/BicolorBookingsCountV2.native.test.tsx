import React from 'react'

import { BicolorBookingsCountV2 } from 'features/bookings/components/BicolorBookingsCountV2'
import { render, screen } from 'tests/utils'

jest.useFakeTimers()

describe('<BicolorBookingsCountV2 />', () => {
  it('should display booking icon with count', async () => {
    render(<BicolorBookingsCountV2 badgeValue={1} />)

    expect(await screen.findByText('1')).toBeOnTheScreen()
  })
})
