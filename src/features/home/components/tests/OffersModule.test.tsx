import { render } from '@testing-library/react-native'
import mockdate from 'mockdate'
import React from 'react'

import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { ColorsEnum } from 'ui/theme'

import { AlgoliaParametersFields, DisplayParametersFields } from '../../contentful/contentful'
import { OffersModule } from '../OffersModule'

mockdate.set(new Date(2020, 10, 16))

const props = {
  algolia: {} as AlgoliaParametersFields,
  display: { minOffers: 0 } as DisplayParametersFields,
  hits: mockedAlgoliaResponse.hits,
  nbHits: mockedAlgoliaResponse.nbHits,
  cover: null,
  position: null,
}

describe('OffersModule component', () => {
  it('should render correctly - with black title', () => {
    const component = render(reactQueryProviderHOC(<OffersModule {...props} index={1} />))
    expect(component).toMatchSnapshot()
    expect(component.getByTestId('moduleTitle').props.color).toBe(ColorsEnum.BLACK)
  })
  it('should render with white title if firert module displayed', async () => {
    const component = render(reactQueryProviderHOC(<OffersModule {...props} index={0} />))
    expect(component.getByTestId('moduleTitle').props.color).toBe(ColorsEnum.WHITE)
  })
})
