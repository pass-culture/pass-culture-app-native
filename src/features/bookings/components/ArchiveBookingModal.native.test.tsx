import { rest } from 'msw'
import React from 'react'

import {
  ArchiveBookingModal,
  ArchiveBookingModalProps,
} from 'features/bookings/components/ArchiveBookingModal'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, render, waitFor } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

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

describe('<ArchiveBookingModal />', () => {
  it('should call on onDismiss', () => {
    const onDismiss = jest.fn()
    const { getByTestId } = renderArchiveDigitalBookingOfferModal({
      visible: true,
      bookingId: 2,
      bookingTitle: 'title',
      onDismiss,
    })
    const button = getByTestId('Retourner à ma réservation')
    fireEvent.press(button)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
  it('should call the mutation to toggle booking display', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/bookings/2/toggle_display', (req, res, ctx) =>
        res.once(ctx.status(204))
      )
    )
    const onDismiss = jest.fn()
    const { getByText } = renderArchiveDigitalBookingOfferModal({
      visible: true,
      bookingId: 2,
      bookingTitle: 'title',
      onDismiss,
    })

    const cancelButton = getByText('Terminer ma réservation')

    fireEvent.press(cancelButton)

    await waitFor(() => {
      expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
        message:
          'La réservation a bien été archivée. Tu pourras la retrouver dans tes réservations terminées',
        timeout: 5000,
      })
      expect(onDismiss).toHaveBeenCalledTimes(1)
      expect(mockGoBack).toBeCalledTimes(1)
    })
  })
  it('should show error snackbar if terminate booking request fails', async () => {
    const response = { code: 'ALREADY_USED', message: 'La réservation a déjà été utilisée.' }
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/bookings/2/toggle_display', (req, res, ctx) =>
        res.once(ctx.status(400), ctx.json(response))
      )
    )

    const onDismiss = jest.fn()
    const { getByText } = renderArchiveDigitalBookingOfferModal({
      visible: true,
      bookingId: 2,
      bookingTitle: 'title',
      onDismiss,
    })

    const cancelButton = getByText('Terminer ma réservation')
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
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<ArchiveBookingModal {...props} />))
}
