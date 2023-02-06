import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { render, waitFor } from 'tests/utils'

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('react-query')
jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')

const mockSubcategories = placeholderData.subcategories
const mockHomepageLabels = placeholderData.homepageLabels
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      homepageLabels: mockHomepageLabels,
    },
  }),
}))
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
