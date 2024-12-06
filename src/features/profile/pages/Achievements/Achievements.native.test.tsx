import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'

import { Achievements } from './Achievements'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<Achievements/>', () => {
  it('should match snapshot', () => {
    render(<Achievements />)

    expect(screen).toMatchSnapshot()
  })

  it('should open modale when press an achievement', async () => {
    render(<Achievements />)

    const firstMovieBookingAchievement = screen.getByText('Mangeur de popcorns')
    fireEvent.press(firstMovieBookingAchievement)

    expect(await screen.findByText('Tu as réservé ta première séance de cinéma')).toBeOnTheScreen()
  })
})
