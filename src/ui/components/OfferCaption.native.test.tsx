import React from 'react'

import { render, screen } from 'tests/utils'

import { OfferCaption } from './OfferCaption'

const props = {
  name: 'Mensch ! Où sont les Hommes ?',
  date: 'Dès le 2 mars 2020',
  price: 'Dès 5€',
  categoryLabel: 'Cinéma',
  width: 160,
}

describe('OfferCaption component', () => {
  afterAll(() => jest.resetAllMocks())

  it.each([
    { element: 'price', text: 'Dès 5€' },
    { element: 'date', text: 'Dès le 2 mars 2020' },
    { element: 'title', text: 'Mensch ! Où sont les Hommes ?' },
    { element: 'category', text: 'Cinéma' },
  ])('should display offer $element', ({ text }) => {
    render(<OfferCaption {...props} />)

    expect(screen.getByText(text)).toBeOnTheScreen()
  })

  it('should display offer distance when provided', () => {
    render(<OfferCaption {...props} distance="10 km" />)

    expect(screen.getByText('à 10 km • Dès le 2 mars 2020')).toBeOnTheScreen()
  })
})
