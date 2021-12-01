import React from 'react'

import { DisplayParametersFields } from 'features/home/contentful'
import { mockVenues } from 'libs/algolia/mockedResponses/mockedVenues'
import { render } from 'tests/utils'

import { VenuesModule } from '../VenuesModule'

jest.mock('react-query')

const props = {
  display: { title: 'Module title' } as DisplayParametersFields,
  hits: mockVenues.hits,
  userPosition: { latitude: 2, longitude: 40 },
}

describe('VenuesModule component', () => {
  it('should render correctly', () => {
    const component = render(<VenuesModule {...props} />)
    expect(component).toMatchSnapshot()
  })
})
