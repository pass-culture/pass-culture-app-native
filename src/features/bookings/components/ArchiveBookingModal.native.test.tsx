import React from 'react'

import {
  ArchiveBookingModal,
  ArchiveBookingModalProps,
} from 'features/bookings/components/ArchiveBookingModal'
import * as useGoBack from 'features/navigation/useGoBack'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('libs/jwt/jwt')

const mockShowErrorSnackBar = jest.fn()
const mockShowSuccessSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

const onDismiss = jest.fn()
const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const props = {
  visible: true,
  bookingId: 2,
  bookingTitle: 'title',
  onDismiss,
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('<ArchiveBookingModal />', () => {
  it('should call on onDismiss', async () => {
    renderArchiveDigitalBookingOfferModal(props)

    const button = screen.getByTestId('Retourner à ma réservation')
    await user.press(button)

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('should call the Success SnackBar when success on archiving reservation', async () => {
    mockServer.postApi('/v1/bookings/2/toggle_display', {})

    renderArchiveDigitalBookingOfferModal(props)

    const cancelButton = screen.getByText('Terminer ma réservation')
    await user.press(cancelButton)

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message:
        'La réservation a bien été archivée. Tu pourras la retrouver dans tes réservations terminées',
      timeout: 5000,
    })
  })

  it('should call goBack when success on archiving reservation', async () => {
    mockServer.postApi('/v1/bookings/2/toggle_display', {})

    renderArchiveDigitalBookingOfferModal(props)

    const cancelButton = screen.getByText('Terminer ma réservation')
    await user.press(cancelButton)

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should show error snackbar if terminate booking request fails', async () => {
    const response = {
      code: 'ALREADY_USED',
      message: 'La réservation a déjà été utilisée.',
    }
    mockServer.postApi('/v1/bookings/2/toggle_display', {
      responseOptions: { statusCode: 400, data: response },
    })

    renderArchiveDigitalBookingOfferModal(props)

    const cancelButton = screen.getByText('Terminer ma réservation')
    await user.press(cancelButton)

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: response.message,
      timeout: 5000,
    })
  })
})

function renderArchiveDigitalBookingOfferModal(props: ArchiveBookingModalProps) {
  return render(reactQueryProviderHOC(<ArchiveBookingModal {...props} />))
}
