import React from 'react'
import { mocked } from 'ts-jest/utils'

import { useRoute } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/AuthContext'
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

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

const venueId = venueResponseSnap.id

describe('<VenueBody />', () => {
  it('should render correctly', async () => {
    const venue = await renderVenueBody(venueId)
    expect(venue).toMatchSnapshot()
  })

  it('should render public name, postalcode and city if no address', async () => {
    // @ts-ignore ts(2345)
    mockedUseVenue.mockReturnValueOnce({ data: venueWithNoAddressResponseSnap })

    const venueWithNoAddressId = venueWithNoAddressResponseSnap.id
    const venue = await renderVenueBody(venueWithNoAddressId)

    const adressTexts = venue.getAllByText('Le Petit Rintintin 3, 15000 Milan')
    expect(adressTexts.length).toEqual(2)
  })

  it('should show withdrawalDetails', async () => {
    const venue = await renderVenueBody(venueId)
    expect(venue.queryByText('Modalités de retrait')).toBeTruthy()
  })

  it('should not show withdrawalDetails for non logged user', async () => {
    const venue = await renderVenueBody(venueId, { isLoggedIn: false })
    expect(venue.queryByText('Modalités de retrait')).toBeFalsy()
  })

  it('should not show withdrawalDetails', async () => {
    const venue = await renderVenueBody(venueId)
    expect(venue.queryByText('Modalités de retrait')).toBeFalsy()
  })
})

async function renderVenueBody(id: number, { isLoggedIn } = { isLoggedIn: true }) {
  useRoute.mockImplementation(() => ({ params: { id } }))

  const setIsLoggedIn = jest.fn()
  mockUseAuthContext.mockImplementation(() => ({ isLoggedIn, setIsLoggedIn }))

  const wrapper = render(<VenueBody venueId={id} onScroll={jest.fn()} />)
  await waitFor(() => wrapper.getByTestId('venue-container'))
  return wrapper
}
