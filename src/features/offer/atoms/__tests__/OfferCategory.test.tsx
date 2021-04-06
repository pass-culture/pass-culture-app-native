import React from 'react'

import { CategoryNameEnum } from 'api/gen'
import { render } from 'tests/utils'

import { OfferCategory } from '../OfferCategory'

describe('OfferCategory', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <OfferCategory category={CategoryNameEnum.LIVRE} label="Livre ou carte lecture" />
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
