import React from 'react'

import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { cleanup, fireEvent, render } from 'tests/utils'

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
    cleanup()
  })

  it('should dismiss modal when click on rightIconButton and reset state', () => {
    const page = render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={20} />)
    )

    const dismissModalButton = page.getByTestId('Fermer la modale')

    fireEvent.press(dismissModalButton)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET' })
    expect(mockDismissModal).toHaveBeenCalled()
  })

  it('should not log event BookingProcessStart when modal is not visible', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible={false} offerId={20} />))
    expect(analytics.logBookingProcessStart).not.toHaveBeenCalled()
  })

  it('should log event BookingProcessStart when modal opens', () => {
    const offerId = 30
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<BookingOfferModalComponent visible offerId={offerId} />))
    expect(analytics.logBookingProcessStart).toHaveBeenCalledWith(offerId)
  })

  it('should show AlreadyBooked when isEndedUsedBooking is true', () => {
    const offerId = 30
    const renderAPI = render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(
        <BookingOfferModalComponent visible offerId={offerId} isEndedUsedBooking />
      )
    )
    expect(renderAPI.queryByText('Tu as déjà réservé :')).toBeTruthy()
    expect(renderAPI.queryByTestId('external-link-booking-limit-exceeded')).toBeTruthy()
  })
})
