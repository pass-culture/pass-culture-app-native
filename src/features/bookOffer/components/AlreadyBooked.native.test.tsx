import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OfferResponseV2 } from 'api/gen'
import { initialBookingState, Step } from 'features/bookOffer/context/reducer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
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

jest.mock('libs/firebase/analytics/analytics')

describe('<AlreadyBooked />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should dismiss modal when clicking on cta', () => {
    render(<AlreadyBooked offer={{ name: 'hello' } as OfferResponseV2} />)
    fireEvent.press(screen.getByText('Mes réservations terminées'))

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should change booking step from date to confirmation', () => {
    render(<AlreadyBooked offer={{ name: 'hello' } as OfferResponseV2} />)

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'CHANGE_STEP',
      payload: Step.CONFIRMATION,
    })
  })

  it('should navigate to bookings when clicking on cta', async () => {
    render(<AlreadyBooked offer={{ name: 'hello' } as OfferResponseV2} />)
    await fireEvent.press(screen.getByText('Mes réservations terminées'))

    expect(navigate).toHaveBeenCalledWith('Bookings', undefined)
  })
})
