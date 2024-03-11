import React from 'react'

import { OfferNotFound } from 'features/offer/pages/OfferNotFound/OfferNotFound'
import { render } from 'tests/utils'

const resetErrorBoundary = () => null
const error = new Error('error')

describe('<OfferNotFound />', () => {
  it('should render correctly', () => {
    expect(
      render(<OfferNotFound error={error} resetErrorBoundary={resetErrorBoundary} />)
    ).toMatchSnapshot()
  })
})
