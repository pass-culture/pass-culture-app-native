import React from 'react'

import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils'

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
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should dismiss modal when click on rightIconButton and reset state', () => {
    const page = render(
      reactQueryProviderHOC(<BookingOfferModalComponent visible={true} offerId={20} />)
    )

    const dismissModalButton = page.getByTestId('rightIconButton')

    fireEvent.press(dismissModalButton)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET' })
    expect(mockDismissModal).toHaveBeenCalled()
  })

  it('should not log event BookingProcessStart when modal is not visible', () => {
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible={false} offerId={20} />))
    expect(analytics.logBookingProcessStart).not.toHaveBeenCalled()
  })

  it('should log event BookingProcessStart when modal opens', () => {
    const offerId = 30
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible={true} offerId={offerId} />))
    expect(analytics.logBookingProcessStart).toHaveBeenCalledWith(offerId)
  })
})
