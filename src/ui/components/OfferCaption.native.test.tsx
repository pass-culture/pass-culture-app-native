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

  it('should display offer price', () => {
    render(<OfferCaption {...props} />)

    expect(screen.getByText('Dès 5€')).toBeOnTheScreen()
  })

  it('should display offer date', () => {
    render(<OfferCaption {...props} />)

    expect(screen.getByText('Dès le 2 mars 2020')).toBeOnTheScreen()
  })

  it('should display offer title', () => {
    render(<OfferCaption {...props} />)

    expect(screen.getByText('Mensch ! Où sont les Hommes ?')).toBeOnTheScreen()
  })

  it('should display offer category', () => {
    render(<OfferCaption {...props} />)

    expect(screen.getByText('Cinéma')).toBeOnTheScreen()
  })
})
