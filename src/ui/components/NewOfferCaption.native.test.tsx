import React from 'react'

import { render, screen } from 'tests/utils'

import { NewOfferCaption } from './NewOfferCaption'

const props = {
  name: 'Mensch ! Où sont les Hommes ?',
  date: 'Dès le 2 mars 2020',
  price: 'Dès 5€',
  categoryLabel: 'Cinéma',
}

describe('NewOfferCaption component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should display offer infos', () => {
    render(<NewOfferCaption {...props} />)

    expect(screen.getByTestId('priceIsDuo').children[0]).toBe('Dès 5€')
    expect(screen.getByText('Dès le 2 mars 2020')).toBeOnTheScreen()
    expect(screen.getByText('Mensch ! Où sont les Hommes ?')).toBeOnTheScreen()
    expect(screen.getByText('Cinéma')).toBeOnTheScreen()
  })
})
