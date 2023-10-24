import React from 'react'

import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { render } from 'tests/utils/web'

import { ContactBlock } from '../ContactBlock'

jest.mock('features/venue/api/useVenue')

describe('<ContactBlock/>', () => {
  it('should match snapshot', () => {
    const renderAPI = render(<ContactBlock venueId={venueResponseSnap.id} />)

    expect(renderAPI).toMatchSnapshot()
  })
})
