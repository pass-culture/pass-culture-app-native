import React from 'react'

import { render } from 'tests/utils/web'

import { OfferCaption } from '../OfferCaption'

const props = {
  name: 'Mensch\u00a0! Où sont les Hommes\u00a0?',
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
    expect(renderAPI.getByTestId('priceIsDuo').textContent).toBe('Dès 5€ - Duo')

    renderAPI.rerender(<OfferCaption {...props} isDuo={false} />)
    expect(renderAPI.getByTestId('priceIsDuo').textContent).toBe('Dès 5€')
  })

  it('should not have the isDuo text if user is not Beneficiary', () => {
    const { getByTestId } = render(<OfferCaption {...props} isBeneficiary={false} />)
    expect(getByTestId('priceIsDuo').textContent).toBe('Dès 5€')
  })
})
