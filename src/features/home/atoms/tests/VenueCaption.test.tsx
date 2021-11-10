import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { render } from 'tests/utils'

import { VenueCaption } from '../VenueCaption'

const props = {
  name: 'Musée du Louvre',
  width: 100,
  venueType: VenueTypeCodeKey.MUSEUM,
}

describe('VenueCaption component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<VenueCaption {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
