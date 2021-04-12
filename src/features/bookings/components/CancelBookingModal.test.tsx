import React from 'react'

import { bookingsSnap } from 'features/bookings/api/bookingsSnap'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import { fireEvent, render } from 'tests/utils'

const mockDismissModal = jest.fn()
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    data: { firstName: 'Christophe', lastName: 'Dupont', isBeneficiary: true },
  })),
}))

let mockIsCreditExpired = false
jest.mock('features/home/services/useAvailableCredit', () => ({
  useAvailableCredit: jest.fn(() => ({ isExpired: mockIsCreditExpired, amount: 2000 })),
}))

describe('<CancelBookingModal />', () => {
  beforeEach(jest.clearAllMocks)

  it('should dismiss modal on press rightIconButton', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const page = render(
      <CancelBookingModal visible={true} dismissModal={mockDismissModal} booking={booking} />
    )

    const dismissModalButton = page.getByTestId('rightIconButton')

    fireEvent.press(dismissModalButton)
    expect(mockDismissModal).toHaveBeenCalled()
  })

  it('should dismiss modal on press "retourner à ma réservation', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = render(
      <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
    )

    const goBackButton = getByText('Retourner à ma réservation')

    fireEvent.press(goBackButton)
    expect(mockDismissModal).toHaveBeenCalled()
  })

  it('should display offer name', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = render(
      <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
    )
    getByText('Avez-vous déjà vu ?')
  })

  it('should display refund rule if user is beneficiary and offer is not free', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = render(
      <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
    )
    getByText('19' + '\u00a0' + '€ seront recrédités sur ton pass Culture.')
  })

  it('should display refund rule if user is ex beneficiary and offer is not free', () => {
    mockIsCreditExpired = true
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = render(
      <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
    )

    getByText('Les 19 € ne seront pas recrédités sur ton pass Culture car il est expiré.')
  })
})
