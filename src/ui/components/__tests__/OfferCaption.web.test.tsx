import React from 'react'

import { render, screen } from 'tests/utils/web'

import { OfferCaption } from '../OfferCaption'

const props = {
  name: 'Mensch ! Où sont les Hommes ?',
  distance: '1,2km',
  imageWidth: 50,
  date: 'Dès le 2 mars 2020',
  isDuo: true,
  isBeneficiary: true,
  price: 'Dès 5€',
}

describe('OfferCaption component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const renderAPI = render(<OfferCaption {...props} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should have the isDuo text if user is Beneficiary', () => {
    const renderAPI = render(<OfferCaption {...props} />)
    expect(screen.getByTestId('priceIsDuo').textContent).toBe('Dès 5€ - Duo')

    renderAPI.rerender(<OfferCaption {...props} isDuo={false} />)
    expect(screen.getByTestId('priceIsDuo').textContent).toBe('Dès 5€')
  })

  it('should not have the isDuo text if user is not Beneficiary', () => {
    render(<OfferCaption {...props} isBeneficiary={false} />)
    expect(screen.getByTestId('priceIsDuo').textContent).toBe('Dès 5€')
  })
})
