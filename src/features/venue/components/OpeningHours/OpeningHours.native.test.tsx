import React from 'react'

import { venueWithOpeningHours } from 'features/venue/fixtures/venueWithOpeningHours'
import { render, screen } from 'tests/utils'

import { OpeningHours } from './OpeningHours'

describe('OpeningHours', () => {
  it('should return opening hours accessibility label with one time slot', () => {
    render(<OpeningHours openingHours={venueWithOpeningHours.openingHours} />)

    const mondayOpeningHoursAccessibilityLabel = screen.getByLabelText('Lundi 09:00 - 19:00')

    expect(mondayOpeningHoursAccessibilityLabel).toBeOnTheScreen()
  })

  it('should return opening hours accessibility label with two time slots', () => {
    render(<OpeningHours openingHours={venueWithOpeningHours.openingHours} />)

    const tuesdayOpeningHoursAccessibilityLabel = screen.getByLabelText(
      'Mardi 09:00 - 12:00 puis 14:00 - 19:00'
    )

    expect(tuesdayOpeningHoursAccessibilityLabel).toBeOnTheScreen()
  })
})
