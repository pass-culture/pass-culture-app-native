import React from 'react'

import { OfferHero } from 'features/offer/components/OfferHero'
import { render } from 'tests/utils'

describe('HeroImage', () => {
  it('shows both placeholders when url is empty', () => {
    const { queryByTestId } = render(<OfferHero imageUrl={''} />)
    expect(queryByTestId('BackgroundPlaceholder')).toBeTruthy()
    expect(queryByTestId('categoryIcon')).toBeTruthy()
    expect(queryByTestId('offerPlaceholder')).toBeTruthy()
  })
  it('shows both placeholders when url is undefined', () => {
    // @ts-ignore : for test purpose
    const { queryByTestId } = render(<OfferHero imageUrl={undefined} />)
    expect(queryByTestId('BackgroundPlaceholder')).toBeTruthy()
    expect(queryByTestId('categoryIcon')).toBeTruthy()
    expect(queryByTestId('offerPlaceholder')).toBeTruthy()
  })
  it('does not show placeholders when an url is defined', () => {
    const { queryByTestId } = render(<OfferHero imageUrl={'some_url_to_some_resource'} />)
    expect(queryByTestId('BackgroundPlaceholder')).toBeFalsy()
    expect(queryByTestId('categoryIcon')).toBeFalsy()
    expect(queryByTestId('offerPlaceholder')).toBeFalsy()
  })
})
