import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { BookingOfferModalComponent } from '../BookingOfferModal'
import { Step } from '../reducer'

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

const mockStep = Step.DATE

jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBooking: jest.fn(() => ({
    dispatch: mockDispatch,
    bookingState: { quantity: 1, step: mockStep },
  })),
  useBookingOffer: jest.fn(() => mockOffer),
}))

describe('<BookingOfferModalComponent />', () => {
  it('should dismiss modal when click on rightIconButton and reset state', () => {
    const page = render(
      reactQueryProviderHOC(
        <BookingOfferModalComponent visible={true} dismissModal={mockDismissModal} offerId={20} />
      )
    )

    const dismissModalButton = page.getByTestId('rightIconButton')

    fireEvent.press(dismissModalButton)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'INIT', payload: {} })
    expect(mockDismissModal).toHaveBeenCalled()
  })
})
