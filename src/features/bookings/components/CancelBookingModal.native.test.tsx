import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { BookingReponse } from 'api/gen'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import { bookingsSnap } from 'features/bookings/fixtures'
import { getTabHookConfig } from 'features/navigation/TabBar/helpers'
import { beneficiaryUser, nonBeneficiaryUser as exBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

const mockDismissModal = jest.fn()

jest.mock('libs/jwt/jwt')

const mockUseAuthContext = jest.fn().mockReturnValue({ user: beneficiaryUser })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
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

const booking = bookingsSnap.ongoing_bookings[0]

const user = userEvent.setup()
jest.useFakeTimers()

describe('<CancelBookingModal />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  it('should dismiss modal on press rightIconButton', async () => {
    renderCancelBookingModal(booking)

    const dismissModalButton = screen.getByTestId('Ne pas annuler')

    await user.press(dismissModalButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should dismiss modal on press "retourner à ma réservation', async () => {
    renderCancelBookingModal(booking)

    const goBackButton = screen.getByText('Retourner à ma réservation')

    await user.press(goBackButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should log "ConfirmBookingCancellation" on press "Annuler ma réservation"', async () => {
    mockServer.postApi(`/v1/bookings/${booking.id}/cancel`, {})

    renderCancelBookingModal(booking)

    await user.press(screen.getByText('Annuler ma réservation'))

    expect(analytics.logConfirmBookingCancellation).toHaveBeenCalledWith(booking.stock.offer.id)
  })

  it('should close modal on success', async () => {
    mockServer.postApi(`/v1/bookings/${booking.id}/cancel`, {})

    renderCancelBookingModal(booking)

    await user.press(screen.getByText('Annuler ma réservation'))

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should showErrorSnackBar and close modal on press "Annuler ma réservation"', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })

    renderCancelBookingModal(booking)

    await user.press(screen.getByText('Annuler ma réservation'))

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: 'Impossible d’annuler la réservation. Connecte-toi à internet avant de réessayer.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should display offer name', () => {
    renderCancelBookingModal(booking)

    expect(screen.getByText('Avez-vous déjà vu ?')).toBeOnTheScreen()
  })

  it('should display refund rule if user is beneficiary', () => {
    renderCancelBookingModal(booking)

    expect(screen.getByText('19\u00a0€ seront recrédités sur ton pass Culture.')).toBeOnTheScreen()
  })

  it('should display refund rule if user is ex beneficiary', () => {
    mockUseAuthContext.mockReturnValueOnce({ user: exBeneficiaryUser })
    renderCancelBookingModal(booking)

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

    renderCancelBookingModal(booking)

    const cancelButton = screen.getByText('Annuler ma réservation')

    await user.press(cancelButton)

    expect(navigate).toHaveBeenCalledWith(...getTabHookConfig('Bookings'))
    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: response.message,
      timeout: 5000,
    })
  })
})

const renderCancelBookingModal = (booking: BookingReponse) => {
  render(
    reactQueryProviderHOC(
      <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
    )
  )
}
