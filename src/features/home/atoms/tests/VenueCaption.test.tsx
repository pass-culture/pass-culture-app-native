import React from 'react'

import { VenueTypeCode } from 'api/gen'
import { render } from 'tests/utils'

import { VenueCaption } from '../VenueCaption'

const props = {
  name: 'Musée du Louvre',
  imageWidth: 100,
  venueType: VenueTypeCode.MUSEUM,
}

describe('VenueCaption component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<VenueCaption {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
