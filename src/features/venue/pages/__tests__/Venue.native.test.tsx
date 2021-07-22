import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, waitFor } from 'tests/utils'

import { Venue } from '../Venue'

const venueId = venueResponseSnap.id

describe('<Venue />', () => {
  afterEach(jest.clearAllMocks)

  it('should match snapshot', async () => {
    const venue = await renderVenue(venueId)
    expect(venue).toMatchSnapshot()
  })
})

async function renderVenue(id: number) {
  useRoute.mockImplementation(() => ({ params: { id } }))
  const wrapper = render(reactQueryProviderHOC(<Venue />))
  await waitFor(() => wrapper.getByTestId('Page de détail du lieu'))
  return wrapper
}
