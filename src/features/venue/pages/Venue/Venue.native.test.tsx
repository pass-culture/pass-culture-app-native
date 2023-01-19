import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { render, waitFor } from 'tests/utils'

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('react-query')
jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')

const venueId = venueResponseSnap.id

describe('<Venue />', () => {
  it('should match snapshot', async () => {
    const venue = await renderVenue(venueId)
    expect(venue).toMatchSnapshot()
  })
})

async function renderVenue(id: number) {
  useRoute.mockImplementation(() => ({ params: { id } }))
  const wrapper = render(<Venue />)
  await waitFor(() => wrapper)
  return wrapper
}
