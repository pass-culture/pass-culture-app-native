import { render } from '@testing-library/react-native'
import React from 'react'

import { AlgoliaParametersFields, DisplayParametersFields } from '../contentful/contentful'

import { OffersModule } from './OffersModule'

const props = {
  algolia: {} as AlgoliaParametersFields,
  display: { minOffers: 0 } as DisplayParametersFields,
}

describe('OffersModule component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<OffersModule {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
