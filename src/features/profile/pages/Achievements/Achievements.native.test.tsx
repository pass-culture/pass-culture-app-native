import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'

import { Achievements } from './Achievements'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<Achievements/>', () => {
  it('should open modale when press a badge', async () => {
    render(<Achievements />)

    const firstMovieBookingBadge = screen.getByText('Cinéphile en herbe')
    fireEvent.press(firstMovieBookingBadge)

    expect(await screen.findByText('Tu as réservé ta première séance de cinéma')).toBeOnTheScreen()
  })
})
