import React from 'react'

import { BookingListItemLabel } from 'features/bookings/components/BookingListItemLabel'
import { render, screen } from 'tests/utils'

describe('<BookingListItemLabel />', () => {
  it('should render default color when no warning', async () => {
    render(<BookingListItemLabel text="Avant dernier jour pour retirer" icon="clock" />)

    expect(screen.getByText('Avant dernier jour pour retirer')).toHaveStyle('color :"#ffffff"')
  })

  it('should render error color when warning', async () => {
    render(<BookingListItemLabel text="Avant dernier jour pour retirer" alert icon="clock" />)

    expect(screen.getByText('Avant dernier jour pour retirer')).toHaveStyle('color :"#f83552"')
  })
})
