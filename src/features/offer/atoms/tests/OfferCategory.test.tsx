import { render } from '@testing-library/react-native'
import React from 'react'

import { AlgoliaCategory } from 'libs/algolia'

import { OfferCategory } from '../OfferCategory'

describe('OfferCategory', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <OfferCategory category={AlgoliaCategory.LIVRE} label="Livre ou carte lecture" />
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
