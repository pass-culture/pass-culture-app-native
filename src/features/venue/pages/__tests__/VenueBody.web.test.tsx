import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, waitFor } from 'tests/utils/web'

import { VenueBody } from '../VenueBody'

describe('<VenueBody />', () => {
  it('should render correctly', async () => {
    const renderAPI = await renderVenueBody()
    expect(renderAPI).toMatchSnapshot()
  })
})

const venueId = 5543
async function renderVenueBody() {
  const wrapper = render(
    reactQueryProviderHOC(<VenueBody venueId={venueId} onScroll={jest.fn()} />)
  )
  await waitFor(() => wrapper.getByTestId('venue-container'))
  return wrapper
}
