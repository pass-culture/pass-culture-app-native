import React from 'react'

import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { render, screen } from 'tests/utils'

import { OpeningHours } from './OpeningHours'

describe('OpeningHours', () => {
  it('should return opening hours accessibility label with one time slot', () => {
    render(<OpeningHours openingHours={venueDataTest.openingHours} title="Horaires d’ouverture" />)

    const mondayOpeningHoursAccessibilityLabel = screen.getByLabelText(
      'Horaires d’ouverture – Liste - Élément 1 sur 7 - Lundi 09:00 - 19:00'
    )

    expect(mondayOpeningHoursAccessibilityLabel).toBeOnTheScreen()
  })

  it('should return opening hours accessibility label with two time slots', () => {
    render(<OpeningHours openingHours={venueDataTest.openingHours} title="Horaires d’ouverture" />)

    const tuesdayOpeningHoursAccessibilityLabel = screen.getByLabelText(
      'Horaires d’ouverture – Liste - Élément 2 sur 7 - Mardi 09:00 - 12:00  puis  14:00 - 19:00'
    )

    expect(tuesdayOpeningHoursAccessibilityLabel).toBeOnTheScreen()
  })
})
