import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { render } from 'tests/utils'

import { OfferCategory } from '../OfferCategory'

describe('OfferCategory', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <OfferCategory category={CategoryIdEnum.LIVRE} label="Livre ou carte lecture" />
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
