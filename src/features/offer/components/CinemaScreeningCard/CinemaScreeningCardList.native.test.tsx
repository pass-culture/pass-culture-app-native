import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'

import { CinemaScreeningCardList } from './CinemaScreeningCardList'

describe('<CinemaScreeningCardList />', () => {
  it('should apply the largest measured height to every card', () => {
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

    fireEvent(firstCard, 'layout', { nativeEvent: { layout: { height: 70 } } })
    fireEvent(secondCard, 'layout', { nativeEvent: { layout: { height: 102 } } })

    expect(screen.getByLabelText('17h - VO - 10€')).toHaveStyle({ minHeight: 102 })
    expect(screen.getByLabelText('19h - VF - Avant-première - 12€')).toHaveStyle({ minHeight: 102 })
  })
})
