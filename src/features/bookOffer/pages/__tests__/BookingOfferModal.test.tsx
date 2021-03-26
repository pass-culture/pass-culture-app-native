import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { act } from 'react-test-renderer'

import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromises } from 'tests/utils'

import { BookingOfferModalComponent } from '../BookingOfferModal'
import { Step } from '../reducer'

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

const mockStep = Step.DATE

jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBooking: jest.fn(() => ({
    dispatch: mockDispatch,
    bookingState: { quantity: 1, step: mockStep },
    dismissModal: mockDismissModal,
  })),
  useBookingOffer: jest.fn(() => mockOffer),
}))

describe('<BookingOfferModalComponent />', () => {
  it('should dismiss modal when click on rightIconButton and reset state', async () => {
    const page = render(
      reactQueryProviderHOC(<BookingOfferModalComponent visible={true} offerId={20} />)
    )

    await act(async () => {
      await flushAllPromises()
    })

    fireEvent.press(page.getByTestId('rightIconButton'))
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET' })
    expect(mockDismissModal).toHaveBeenCalled()
  })
})
