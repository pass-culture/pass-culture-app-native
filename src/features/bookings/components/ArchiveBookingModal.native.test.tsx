import React from 'react'

import {
  ArchiveBookingModal,
  ArchiveBookingModalProps,
} from 'features/bookings/components/ArchiveBookingModal'
import * as useGoBack from 'features/navigation/useGoBack'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
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

jest.mock('libs/react-query/usePersistQuery', () => ({
  usePersistQuery: jest.requireActual('react-query').useQuery,
}))

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<ArchiveBookingModal />', () => {
  it('should call on onDismiss', () => {
    const onDismiss = jest.fn()

    renderArchiveDigitalBookingOfferModal({
      visible: true,
      bookingId: 2,
      bookingTitle: 'title',
      onDismiss,
    })

    const button = screen.getByTestId('Retourner à ma réservation')
    fireEvent.press(button)

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('should call the mutation to toggle booking display', async () => {
    mockServer.postApi('/v1/bookings/2/toggle_display', {})

    const onDismiss = jest.fn()

    renderArchiveDigitalBookingOfferModal({
      visible: true,
      bookingId: 2,
      bookingTitle: 'title',
      onDismiss,
    })

    const cancelButton = screen.getByText('Terminer ma réservation')

    fireEvent.press(cancelButton)

    await waitFor(() => {
      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message:
          'La réservation a bien été archivée. Tu pourras la retrouver dans tes réservations terminées',
        timeout: 5000,
      })
      expect(onDismiss).toHaveBeenCalledTimes(1)
      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })
  })

  it('should show error snackbar if terminate booking request fails', async () => {
    const response = {
      code: 'ALREADY_USED',
      message: 'La réservation a déjà été utilisée.',
    }
    mockServer.postApi('/v1/bookings/2/toggle_display', {
      responseOptions: { statusCode: 400, data: response },
    })

    const onDismiss = jest.fn()

    renderArchiveDigitalBookingOfferModal({
      visible: true,
      bookingId: 2,
      bookingTitle: 'title',
      onDismiss,
    })

    const cancelButton = screen.getByText('Terminer ma réservation')
    fireEvent.press(cancelButton)

    await waitFor(() => {
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: response.message,
        timeout: 5000,
      })
    })
  })
})

function renderArchiveDigitalBookingOfferModal(props: ArchiveBookingModalProps) {
  return render(reactQueryProviderHOC(<ArchiveBookingModal {...props} />))
}
