import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

const mockDismissModal = jest.fn()

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

let mockIsCreditExpired = false
jest.mock('shared/user/useAvailableCredit', () => ({
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

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<CancelBookingModal />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  it('should dismiss modal on press rightIconButton', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )

    const dismissModalButton = screen.getByTestId('Ne pas annuler')

    fireEvent.press(dismissModalButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should dismiss modal on press "retourner à ma réservation', () => {
    const booking = bookingsSnap.ongoing_bookings[0]

    render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )

    const goBackButton = screen.getByText('Retourner à ma réservation')

    fireEvent.press(goBackButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should log "ConfirmBookingCancellation" on press "Annuler ma réservation"', async () => {
    const booking = bookingsSnap.ongoing_bookings[0]

    mockServer.postApi(`/v1/bookings/${booking.id}/cancel`, {})

    render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )

    await act(async () => {
      fireEvent.press(screen.getByText('Annuler ma réservation'))
    })

    expect(analytics.logConfirmBookingCancellation).toHaveBeenCalledWith(booking.stock.offer.id)
  })

  it('should close modal on success', async () => {
    const booking = bookingsSnap.ongoing_bookings[0]

    mockServer.postApi(`/v1/bookings/${booking.id}/cancel`, {})

    render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )

    await act(async () => {
      fireEvent.press(screen.getByText('Annuler ma réservation'))
    })

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should showErrorSnackBar and close modal on press "Annuler ma réservation"', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    const booking = bookingsSnap.ongoing_bookings[0]

    render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )

    await act(async () => {
      fireEvent.press(screen.getByText('Annuler ma réservation'))
    })

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: 'Impossible d’annuler la réservation. Connecte-toi à internet avant de réessayer.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should display offer name', () => {
    const booking = bookingsSnap.ongoing_bookings[0]

    render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )

    expect(screen.getByText('Avez-vous déjà vu ?')).toBeOnTheScreen()
  })

  it('should display refund rule if user is beneficiary and offer is not free', () => {
    const booking = bookingsSnap.ongoing_bookings[0]

    render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )

    expect(screen.getByText('19\u00a0€ seront recrédités sur ton pass Culture.')).toBeOnTheScreen()
  })

  it('should display refund rule if user is ex beneficiary and offer is not free', () => {
    mockIsCreditExpired = true
    const booking = bookingsSnap.ongoing_bookings[0]

    render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )

    expect(
      screen.getByText(
        'Les 19\u00a0€ ne seront pas recrédités sur ton pass Culture car il est expiré.'
      )
    ).toBeOnTheScreen()
  })

  it('should navigate to bookings and show error snackbar if cancel booking request fails', async () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const response = {
      code: 'ALREADY_USED',
      message: 'La réservation a déjà été utilisée.',
    }

    mockServer.postApi(`/v1/bookings/${booking.id}/cancel`, {
      responseOptions: { statusCode: 401, data: response },
    })

    render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )

    const cancelButton = screen.getByText('Annuler ma réservation')

    fireEvent.press(cancelButton)

    await waitFor(async () => {
      expect(navigate).toHaveBeenCalledWith(...getTabNavConfig('Bookings'))
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: response.message,
        timeout: 5000,
      })
    })
  })
})
