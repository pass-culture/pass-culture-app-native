import { render } from '@testing-library/react-native'
import { act } from '@testing-library/react-native'
import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromises } from 'tests/utils'

import { BookingDetails } from '../BookingDetails'

import { mockOffer } from './offerFixture'

jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBooking: jest.fn(() => ({ bookingState: { quantity: 1 } })),
  useBookingStock: jest.fn(() => ({ price: 2000, id: '123456' })),
  useBookingOffer: jest.fn(() => mockOffer),
}))

describe('<BookingDetails />', () => {
  it('should render correctly', async () => {
    const page = await renderBookingDetails()
    expect(page).toMatchSnapshot()
  })
})

const renderBookingDetails = async () => {
  const renderAPI = render(reactQueryProviderHOC(<BookingDetails dismissModal={jest.fn()} />))

  await act(flushAllPromises)

  return renderAPI
}
