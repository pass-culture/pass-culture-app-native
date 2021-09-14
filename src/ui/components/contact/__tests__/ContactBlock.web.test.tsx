import React from 'react'

import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { render } from 'tests/utils/web'

import { ContactBlock } from '../ContactBlock'

describe('<ContactBlock/>', () => {
  it('should match snapshot', () => {
    const wrapper = render(
      <ContactBlock
        venueName={venueResponseSnap.publicName || ''}
        email="email@example.com"
        phoneNumber="+33102030405"
        website="https://my@website.com"
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
