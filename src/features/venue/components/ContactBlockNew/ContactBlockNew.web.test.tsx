import React from 'react'

import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { render } from 'tests/utils/web'

import { ContactBlock } from './ContactBlockNew'

describe('<ContactBlock/>', () => {
  it('should match snapshot', () => {
    const renderAPI = render(<ContactBlock venue={venueResponseSnap} />)

    expect(renderAPI).toMatchSnapshot()
  })
})
