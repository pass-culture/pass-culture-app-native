import { render } from '@testing-library/react-native'
import React from 'react'

import { CategoryNameEnum } from 'api/gen'

import { OfferCategory } from '../OfferCategory'

describe('OfferCategory', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <OfferCategory category={CategoryNameEnum.LIVRE} label="Livre ou carte lecture" />
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
