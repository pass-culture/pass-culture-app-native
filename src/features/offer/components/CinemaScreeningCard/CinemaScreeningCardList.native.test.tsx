import React from 'react'

import { render, screen } from 'tests/utils'

import { CinemaScreeningCardList } from './CinemaScreeningCardList'

describe('<CinemaScreeningCardList />', () => {
  it('should allow every card to grow to the height of the list', () => {
    render(
      <CinemaScreeningCardList
        screenings={[
          { time: '17h', languages: ['VO'], price: '10€', onPress: jest.fn() },
          {
            time: '19h',
            languages: ['VF'],
            price: '12€',
            specialEvent: 'Avant-première',
            onPress: jest.fn(),
          },
        ]}
      />
    )

    const firstCard = screen.getByLabelText('17h - VO - 10€')
    const secondCard = screen.getByLabelText('19h - VF - Avant-première - 12€')

    expect(firstCard).toHaveStyle({ flexGrow: 1 })
    expect(secondCard).toHaveStyle({ flexGrow: 1 })
  })
})
