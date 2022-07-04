import React from 'react'

import { OfferNotFound } from 'features/offer/pages/OfferNotFound'
import { render } from 'tests/utils'

describe('<OfferNotFound />', () => {
  it('should render correctly', () => {
    expect(render(<OfferNotFound />)).toMatchSnapshot()
  })
})
