import { render } from '@testing-library/react-native'
import React from 'react'

import { OfferHero } from '../OfferHero'

describe('OfferHero', () => {
  it('shows both placeholders when url is empty', () => {
    const { queryByTestId } = render(<OfferHero imageUrl={''} />)
    expect(queryByTestId('offerBackPlaceholder')).toBeTruthy()
    expect(queryByTestId('categoryIcon')).toBeTruthy()
    expect(queryByTestId('offerPlaceholder')).toBeTruthy()
  })
  it('shows both placeholders when url is undefined', () => {
    // @ts-ignore : for test purpose
    const { queryByTestId } = render(<OfferHero imageUrl={undefined} />)
    expect(queryByTestId('offerBackPlaceholder')).toBeTruthy()
    expect(queryByTestId('categoryIcon')).toBeTruthy()
    expect(queryByTestId('offerPlaceholder')).toBeTruthy()
  })
  it('does not show placeholders when an url is defined', () => {
    const { queryByTestId } = render(<OfferHero imageUrl={'some_url_to_some_resource'} />)
    expect(queryByTestId('offerBackPlaceholder')).toBeFalsy()
    expect(queryByTestId('categoryIcon')).toBeFalsy()
    expect(queryByTestId('offerPlaceholder')).toBeFalsy()
  })
})
