import React from 'react'

import { OpeningHoursStatus } from 'features/venue/components/OpeningHoursStatus/OpeningHoursStatus'
import { act, render, screen } from 'tests/utils'

const CURRENT_DATE = new Date('2024-05-31T08:30:00')

jest.useFakeTimers().setSystemTime(CURRENT_DATE)

describe('<OpeningHoursStatus />', () => {
  it('should update state automatically when state change is in less than 30 minutes', async () => {
    const openingHours = {
      FRIDAY: [{ open: '09:00', close: '19:00' }],
    }
    render(<OpeningHoursStatus openingHours={openingHours} currentDate={CURRENT_DATE} />)

    expect(screen.getByText('Ouvre bientôt - 9h')).toBeOnTheScreen()

    await act(async () => jest.advanceTimersByTime(30 * 60 * 1000))

    expect(await screen.findByText('Ouvert jusqu’à 19h')).toBeOnTheScreen()
  })

  it('should not update state automatically when state change is in more than 30 minutes', async () => {
    const openingHours = {
      FRIDAY: [{ open: '09:01', close: '19:00' }],
    }
    render(<OpeningHoursStatus openingHours={openingHours} currentDate={CURRENT_DATE} />)

    expect(screen.getByText('Ouvre bientôt - 9h1')).toBeOnTheScreen()

    await act(async () => jest.advanceTimersByTime(31 * 60 * 1000))

    expect(await screen.findByText('Ouvre bientôt - 9h1')).toBeOnTheScreen()
  })
})
