import React from 'react'
import { useMutation } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { bookingsSnap } from 'features/bookings/api/bookingsSnap'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/analytics'
import { fireEvent, render, useMutationFactory } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('react-query')

const mockedUseMutation = mocked(useMutation)
const mockDismissModal = jest.fn()
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    data: { firstName: 'Christophe', lastName: 'Dupont', isBeneficiary: true },
  })),
}))

let mockIsCreditExpired = false
jest.mock('features/home/services/useAvailableCredit', () => ({
  getAvailableCredit: jest.fn(() => ({ isExpired: mockIsCreditExpired, amount: 2000 })),
}))

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn(),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

describe('<CancelBookingModal />', () => {
  it('should dismiss modal on press rightIconButton', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const page = render(
      <CancelBookingModal visible={true} dismissModal={mockDismissModal} booking={booking} />
    )

    const dismissModalButton = page.getByTestId('Ne pas annuler')

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

  it('should log "ConfirmBookingCancellation" on press "Annuler ma réservation"', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = render(
      <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
    )

    fireEvent.press(getByText('Annuler ma réservation'))
    expect(analytics.logConfirmBookingCancellation).toHaveBeenCalledWith(booking.stock.offer.id)
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
    getByText('19\u00a0€ seront recrédités sur ton pass Culture.')
  })

  it('should display refund rule if user is ex beneficiary and offer is not free', () => {
    mockIsCreditExpired = true
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = render(
      <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
    )

    getByText('Les 19\u00a0€ ne seront pas recrédités sur ton pass Culture car il est expiré.')
  })

  it('should navigate to bookings and show error snackbar if cancel booking request fails', async () => {
    const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
      onSuccess: () => {},
      onError: () => {},
    }
    // @ts-expect-error ts(2345)
    mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
    const response = {
      content: { code: 'ALREADY_USED', message: 'La réservation a déjà été utilisée.' },
      name: 'ApiError',
    }

    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = render(
      <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
    )

    const cancelButton = getByText('Annuler ma réservation')

    fireEvent.press(cancelButton)

    useMutationCallbacks.onError(response)
    expect(navigate).toBeCalledWith(...getTabNavConfig('Bookings'))
    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: response.content.message,
      timeout: 5000,
    })
  })
})
