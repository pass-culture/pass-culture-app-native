import React from 'react'

import { mockedSearchResponse } from 'libs/search/fixtures/mockedSearchResponse'
import { render } from 'tests/utils'

import { DisplayParametersFields } from '../../contentful/contentful'
import { VenuesModule } from '../VenuesModule'

jest.mock('react-query')

const props = {
  display: {
    title: 'Module title',
  } as DisplayParametersFields,
  hits: mockedSearchResponse.hits,
  userPosition: { latitude: 2, longitude: 40 },
}

describe('VenuesModule component', () => {
  it('should render correctly', () => {
    const component = render(<VenuesModule {...props} />)
    expect(component).toMatchSnapshot()
  })
})
