import React from 'react'

import {
  ArchiveBookingModal,
  ArchiveBookingModalProps,
} from 'features/bookings/components/ArchiveBookingModal'
import * as useGoBack from 'features/navigation/useGoBack'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/jwt/jwt')

jest.mock('libs/react-query/usePersistQuery', () => ({
  usePersistQuery: jest.requireActual('@tanstack/react-query').useQuery,
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

    expect(screen.getByTestId('snackbar-success')).toBeOnTheScreen()
    expect(
      screen.getByText(
        'La réservation a bien été archivée. Tu pourras la retrouver dans tes réservations terminées'
      )
    ).toBeOnTheScreen()
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

    expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
    expect(screen.getByText(response.message)).toBeOnTheScreen()
  })
})

function renderArchiveDigitalBookingOfferModal(props: ArchiveBookingModalProps) {
  return render(reactQueryProviderHOC(<ArchiveBookingModal {...props} />))
}
