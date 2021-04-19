import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { bookingsSnap } from 'features/bookings/api/bookingsSnap'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { fireEvent, render, superFlushWithAct } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

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

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

describe('<CancelBookingModal />', () => {
  beforeEach(jest.clearAllMocks)

  it('should dismiss modal on press rightIconButton', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const page = render(
      reactQueryProviderHOC(
        <CancelBookingModal visible={true} dismissModal={mockDismissModal} booking={booking} />
      )
    )

    const dismissModalButton = page.getByTestId('rightIconButton')

    fireEvent.press(dismissModalButton)
    expect(mockDismissModal).toHaveBeenCalled()
  })

  it('should dismiss modal on press "retourner à ma réservation', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )

    const goBackButton = getByText('Retourner à ma réservation')

    fireEvent.press(goBackButton)
    expect(mockDismissModal).toHaveBeenCalled()
  })

  it('should log "ConfirmBookingCancellation" on press "Annuler ma réservation"', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )

    fireEvent.press(getByText('Annuler ma réservation'))
    expect(analytics.logConfirmBookingCancellation).toHaveBeenCalledWith(booking.stock.offer.id)
  })

  it('should display offer name', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )
    getByText('Avez-vous déjà vu ?')
  })

  it('should display refund rule if user is beneficiary and offer is not free', () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )
    getByText('19 € seront recrédités sur ton pass Culture.')
  })

  it('should display refund rule if user is ex beneficiary and offer is not free', () => {
    mockIsCreditExpired = true
    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )

    getByText('Les 19 € ne seront pas recrédités sur ton pass Culture car il est expiré.')
  })

  it('should navigate to bookings and show error snackbar if cancel booking request fails', async () => {
    const response = { code: 'ALREADY_USED', message: 'La réservation a déjà été utilisée.' }
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/bookings/123/cancel', (req, res, ctx) =>
        res.once(ctx.status(400), ctx.json(response))
      )
    )

    const booking = bookingsSnap.ongoing_bookings[0]
    const { getByText } = render(
      reactQueryProviderHOC(
        <CancelBookingModal visible dismissModal={mockDismissModal} booking={booking} />
      )
    )

    const cancelButton = getByText('Annuler ma réservation')

    fireEvent.press(cancelButton)

    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('Bookings')
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: response.message,
        timeout: 5000,
      })
    })
  })
})
