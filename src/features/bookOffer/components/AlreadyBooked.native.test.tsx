import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OfferResponseV2 } from 'api/gen'
import { initialBookingState, Step } from 'features/bookOffer/context/reducer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen, userEvent } from 'tests/utils'

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

const user = userEvent.setup()
jest.useFakeTimers()

describe('<AlreadyBooked />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should dismiss modal when clicking on cta', async () => {
    renderAlreadyBookedModal()
    await user.press(screen.getByText('Mes réservations terminées'))

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should change booking step from date to confirmation', () => {
    renderAlreadyBookedModal()

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'CHANGE_STEP',
      payload: Step.CONFIRMATION,
    })
  })

  it('should navigate to bookings when clicking on cta', async () => {
    renderAlreadyBookedModal()
    await user.press(screen.getByText('Mes réservations terminées'))

    expect(navigate).toHaveBeenCalledWith('Bookings', undefined)
  })
})

const renderAlreadyBookedModal = () => {
  render(<AlreadyBooked offer={{ name: 'hello' } as OfferResponseV2} />)
}
