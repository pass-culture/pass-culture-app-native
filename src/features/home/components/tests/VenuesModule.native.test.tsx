import React from 'react'

import { DisplayParametersFields } from 'features/home/contentful'
import { mockVenues } from 'libs/algolia/__mocks__/mockedVenues'
import { render } from 'tests/utils'

import { VenuesModule } from '../VenuesModule'

jest.mock('react-query')
jest.mock('features/home/api/useVenueModule', () => ({
  useVenueModule: jest.fn().mockReturnValue(mockVenues.hits),
}))

const props = {
  moduleId: 'fakemoduleid',
  display: { title: 'Module title', minOffers: 1 } as DisplayParametersFields,
  search: [],
  homeEntryId: 'fakeEntryId',
  index: 1,
}

describe('VenuesModule component', () => {
  it('should render correctly', () => {
    const component = render(<VenuesModule {...props} />)
    expect(component).toMatchSnapshot()
  })
})
