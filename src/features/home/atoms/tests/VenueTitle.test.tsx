import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { VenueTypeCode } from 'libs/parsers'
import { render } from 'tests/utils'

import { VenueTitle } from '../VenueTitle'

const props = {
  name: 'Musée du Louvre',
  width: 100,
  venueType: VenueTypeCodeKey.MUSEUM as VenueTypeCode,
}

describe('VenueTitle component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<VenueTitle {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should show distance prop when provided', () => {
    const { getByText } = render(<VenueTitle {...props} distance={'100km'} />)
    expect(getByText(' | 100km')).toBeTruthy()
  })
})
