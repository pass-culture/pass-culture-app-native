import React from 'react'

import { VenueTypeCode } from 'api/gen'
import { mockedSearchResponse } from 'libs/search/fixtures/mockedSearchResponse'
import { render } from 'tests/utils'

import { VenueTile } from '../VenueTile'

jest.mock('react-query')

const venueResponse = mockedSearchResponse.hits[0]

const props = {
  name: venueResponse.venue.name,
  venueType: VenueTypeCode.MUSEUM,
}

describe('VenueTile component', () => {
  it('should render correctly', () => {
    const component = render(<VenueTile {...props} />)
    expect(component).toMatchSnapshot()
  })
})
