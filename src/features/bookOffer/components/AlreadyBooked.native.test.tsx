import React from 'react'

import { OfferResponse } from 'api/gen'
import { fireEvent, render } from 'tests/utils'

import { AlreadyBooked } from './AlreadyBooked'

const mockDismissModal = jest.fn()
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: () => ({ dismissModal: mockDismissModal }),
}))

describe('<AlreadyBooked />', () => {
  it('should dismiss modal when clicking on cta', () => {
    const renderAPI = render(<AlreadyBooked offer={{ name: 'hello' } as OfferResponse} />)
    fireEvent.press(renderAPI.getByText('Mes réservations terminées'))
    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })
})
