import React from 'react'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { useRoute } from '__mocks__/@react-navigation/native'
import { VenueResponse } from 'api/gen'
import { useVenue } from 'features/venue/api/useVenue'
import {
  venueWithNoAddressResponseSnap,
  venueResponseSnap,
} from 'features/venue/fixtures/venueResponseSnap'
import { render, waitFor } from 'tests/utils/web'

import { VenueBody } from '../VenueBody'

jest.mock('react-query')

jest.mock('features/venue/api/useVenue')
const mockedUseVenue = mocked(useVenue)

const venueId = venueResponseSnap.id

describe('<VenueBody />', () => {
  it('should render correctly', async () => {
    const venue = await renderVenueBody(venueId)
    expect(venue).toMatchSnapshot()
  })

  it('should render public name, postalcode and city if no address', async () => {
    mockedUseVenue.mockReturnValueOnce({
      data: venueWithNoAddressResponseSnap,
    } as UseQueryResult<VenueResponse>)

    const venueWithNoAddressId = venueWithNoAddressResponseSnap.id
    const venue = await renderVenueBody(venueWithNoAddressId)

    const adressTexts = venue.getAllByText('Le Petit Rintintin 3, 15000 Milan')
    expect(adressTexts.length).toEqual(2)
  })

  it('should show withdrawalDetails', async () => {
    const venue = await renderVenueBody(venueId)
    expect(venue.queryByText('Modalités de retrait')).toBeTruthy()
  })

  it('should not show withdrawalDetails if withdrawalDetails is null', async () => {
    mockedUseVenue.mockReturnValueOnce({
      data: { ...venueResponseSnap, withdrawalDetails: null },
    } as UseQueryResult<VenueResponse>)
    const venue = await renderVenueBody(venueId)
    expect(venue.queryByText('Modalités de retrait')).toBeFalsy()
  })
})

async function renderVenueBody(id: number) {
  useRoute.mockImplementation(() => ({ params: { id } }))
  const wrapper = render(<VenueBody venueId={id} onScroll={jest.fn()} />)
  await waitFor(() => wrapper.getByTestId('venue-container'))
  return wrapper
}
