import React from 'react'

import { render, screen } from 'tests/utils'

import { NewOfferCaption } from './NewOfferCaption'

const props = {
  name: 'Mensch ! Où sont les Hommes ?',
  date: 'Dès le 2 mars 2020',
  isDuo: true,
  isBeneficiary: true,
  price: 'Dès 5€',
  categoryLabel: 'Cinéma',
}

describe('NewOfferCaption component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should have the isDuo text if user is Beneficiary and offer is duo', () => {
    render(<NewOfferCaption {...props} />)

    expect(screen.getByTestId('priceIsDuo').children[0]).toBe('Dès 5€ - Duo')

    render(<NewOfferCaption {...props} isDuo={false} />).getByTestId

    expect(screen.getByTestId('priceIsDuo').children[0]).toBe('Dès 5€')
  })

  it('should not have the isDuo text if user is not Beneficiary', () => {
    render(<NewOfferCaption {...props} isBeneficiary={false} />)

    expect(screen.getByTestId('priceIsDuo').children[0]).toBe('Dès 5€')
  })

  it('should not have the isDuo text if offer is not duo', () => {
    render(<NewOfferCaption {...props} isDuo={false} />)

    expect(screen.getByTestId('priceIsDuo').children[0]).toBe('Dès 5€')
  })
})
