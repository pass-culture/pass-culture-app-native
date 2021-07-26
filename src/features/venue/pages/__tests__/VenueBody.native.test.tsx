import React from 'react'
import { mocked } from 'ts-jest/utils'

import { useRoute } from '__mocks__/@react-navigation/native'
import { useVenue } from 'features/venue/api/useVenue'
import {
  venueWithNoAddressResponseSnap,
  venueResponseSnap,
} from 'features/venue/fixtures/venueResponseSnap'
import { render, waitFor } from 'tests/utils'

import { VenueBody } from '../VenueBody'

jest.mock('react-query')

jest.mock('features/venue/api/useVenue')
const mockedUseVenue = mocked(useVenue)

const venueId = venueResponseSnap.id

describe('<VenueBody />', () => {
  it('should render correctly', async () => {
    const venue = await renderVenueBody(venueId)
    expect(venue).toMatchSnapshot()

    venue.getByText('1 boulevard Poissonnière, 75000 Paris')
  })

  it('should render public name, postalcode and city if no address', async () => {
    // @ts-ignore ts(2345)
    mockedUseVenue.mockReturnValueOnce({ data: venueWithNoAddressResponseSnap })

    const venueWithNoAddressId = venueWithNoAddressResponseSnap.id
    const venue = await renderVenueBody(venueWithNoAddressId)

    venue.getByText('Le Petit Rintintin 3, 15000 Milan')
  })
})

async function renderVenueBody(id: number) {
  useRoute.mockImplementation(() => ({ params: { id } }))
  const wrapper = render(<VenueBody venueId={id} onScroll={jest.fn()} />)
  await waitFor(() => wrapper.getByTestId('venue-container'))
  return wrapper
}
