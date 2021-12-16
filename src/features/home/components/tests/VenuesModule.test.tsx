import React from 'react'

import { DisplayParametersFields } from 'features/home/contentful'
import { mockVenues } from 'libs/algolia/mockedResponses/mockedVenues'
import { render } from 'tests/utils'

import { VenuesModule } from '../VenuesModule'

jest.mock('react-query')
jest.mock('features/home/pages/useVenueModule', () => ({
  useVenueModule: jest.fn().mockReturnValue(mockVenues.hits),
}))

const props = {
  moduleId: 'fakemoduleid',
  display: { title: 'Module title' } as DisplayParametersFields,
  search: [],
}

describe('VenuesModule component', () => {
  it('should render correctly', () => {
    const component = render(<VenuesModule {...props} />)
    expect(component).toMatchSnapshot()
  })
})
