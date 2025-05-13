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

  it('should display offer price', () => {
    render(<NewOfferCaption {...props} />)

    expect(screen.getByText('Dès 5€')).toBeOnTheScreen()
  })

  it('should display offer date', () => {
    render(<NewOfferCaption {...props} />)

    expect(screen.getByText('Dès le 2 mars 2020')).toBeOnTheScreen()
  })

  it('should display offer title', () => {
    render(<NewOfferCaption {...props} />)

    expect(screen.getByText('Mensch ! Où sont les Hommes ?')).toBeOnTheScreen()
  })

  it('should display offer category', () => {
    render(<NewOfferCaption {...props} />)

    expect(screen.getByText('Cinéma')).toBeOnTheScreen()
  })
})
