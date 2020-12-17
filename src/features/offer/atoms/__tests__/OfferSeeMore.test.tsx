import { render } from '@testing-library/react-native'
import React from 'react'

import { OfferSeeMore } from '../OfferSeeMore'
describe('OfferSeeMore', () => {
  it('displays the short wording when no props are precised', () => {
    const { queryByText } = render(<OfferSeeMore />)
    expect(queryByText("Voir plus d'informations")).toBeFalsy()
    expect(queryByText('voir plus')).toBeTruthy()
  })
  it('displays the long wording when precised', () => {
    const { queryByText } = render(<OfferSeeMore longWording />)
    expect(queryByText('voir plus')).toBeFalsy()
    expect(queryByText("Voir plus d'informations")).toBeTruthy()
  })
})
