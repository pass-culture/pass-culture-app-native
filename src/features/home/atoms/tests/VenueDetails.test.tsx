import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { VenueTypeCode } from 'libs/parsers'
import { render } from 'tests/utils'

import { VenueDetails } from '../VenueDetails'

const props = {
  name: 'Musée du Louvre',
  width: 100,
  venueType: VenueTypeCodeKey.MUSEUM as VenueTypeCode,
}

describe('VenueDetails component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<VenueDetails {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should show distance prop when provided', () => {
    const { getByText } = render(<VenueDetails {...props} distance={'100km'} />)
    expect(getByText(' | 100km')).toBeTruthy()
  })
})
