import React from 'react'

import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { render, screen } from 'tests/utils'

import { OpeningHours } from './OpeningHours'

describe('OpeningHours', () => {
  it('should return opening hours accessibility label with one time slot', () => {
    render(<OpeningHours openingHours={venueDataTest.openingHours} />)

    const mondayOpeningHoursAccessibilityLabel = screen.getByLabelText('Lundi 09:00 - 19:00')

    expect(mondayOpeningHoursAccessibilityLabel).toBeOnTheScreen()
  })

  it('should return opening hours accessibility label with two time slots', () => {
    render(<OpeningHours openingHours={venueDataTest.openingHours} />)

    const tuesdayOpeningHoursAccessibilityLabel = screen.getByLabelText(
      'Mardi 09:00 - 12:00 puis 14:00 - 19:00'
    )

    expect(tuesdayOpeningHoursAccessibilityLabel).toBeOnTheScreen()
  })

  it('should return null if no opening hours are provided', () => {
    const openingHours = {
      SUNDAY: undefined,
      MONDAY: undefined,
      TUESDAY: undefined,
      WEDNESDAY: undefined,
      THURSDAY: undefined,
      FRIDAY: undefined,
      SATURDAY: undefined,
    }
    render(<OpeningHours openingHours={openingHours} />)

    expect(screen.toJSON()).toBeNull()
  })
})
