import React from 'react'

import { render, screen } from 'tests/utils'

import { OfferCaption } from './OfferCaption'

const props = {
  name: 'Mensch ! Où sont les Hommes ?',
  distance: '1,2km',
  imageWidth: 50,
  date: 'Dès le 2 mars 2020',
  price: 'Dès 5€',
}

describe('OfferCaption component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should have offer infos', () => {
    render(<OfferCaption {...props} />)

    expect(screen.getByTestId('priceIsDuo').children[0]).toBe('Dès 5€')
    expect(screen.getByText('Dès le 2 mars 2020')).toBeOnTheScreen()
    expect(screen.getByText('Mensch ! Où sont les Hommes ?')).toBeOnTheScreen()
  })
})
