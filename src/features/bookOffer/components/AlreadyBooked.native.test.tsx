import React from 'react'

import { OfferResponse } from 'api/gen'
import { initialBookingState, Step } from 'features/bookOffer/context/reducer'
import { fireEvent, render, screen } from 'tests/utils'

import { AlreadyBooked } from './AlreadyBooked'

const mockInitialBookingState = initialBookingState

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: () => ({
    bookingState: mockInitialBookingState,
    dismissModal: mockDismissModal,
    dispatch: mockDispatch,
  }),
}))

describe('<AlreadyBooked />', () => {
  it('should dismiss modal when clicking on cta', () => {
    render(<AlreadyBooked offer={{ name: 'hello' } as OfferResponse} />)
    fireEvent.press(screen.getByText('Mes réservations terminées'))
    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should change booking step from date to confirmation', () => {
    render(<AlreadyBooked offer={{ name: 'hello' } as OfferResponse} />)
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'CHANGE_STEP',
      payload: Step.CONFIRMATION,
    })
  })
})
