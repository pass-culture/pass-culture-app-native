import React from 'react'

import { canGoBack, goBack, useRoute } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { BookingResponseV3 } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { CinemaScreeningDetailsModal } from 'features/bookings/pages/CinemaScreeningDetailsModal/CinemaScreeningDetailsModal'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('features/navigation/helpers/usePreviousRouteName', () => ({
  usePreviousRouteName: () => 'BookingDetails',
}))

const booking = bookingsSnapV2.ongoingBookings[0]
const user = userEvent.setup()

const mockBooking = (screeningFeatures: unknown) =>
  jest.spyOn(api, 'getNativeV3BookingsbookingId').mockResolvedValueOnce({
    ...booking,
    stock: { ...booking.stock, screeningFeatures },
  } as unknown as BookingResponseV3)

describe('<CinemaScreeningDetailsModal />', () => {
  beforeEach(() => {
    mockAuthContextWithUser(beneficiaryUser, { persist: true })
    useRoute.mockReturnValue({ params: { id: booking.id } })
    canGoBack.mockReturnValue(true)
  })

  it('should display the cinema screening details fetched from the booking id', async () => {
    mockBooking({
      language: 'VF',
      video: 'IMAX',
      audio: null,
      accessibility: { motor: [], audio: [], visual: [], mental: [] },
      specialEventType: null,
    })

    render(reactQueryProviderHOC(<CinemaScreeningDetailsModal />))

    expect(await screen.findByText('Informations sur la séance')).toBeOnTheScreen()
    expect(screen.getByText('IMAX')).toBeOnTheScreen()
  })

  it('should go back when pressing the close button', async () => {
    mockBooking({
      language: 'VF',
      video: 'IMAX',
      audio: null,
      accessibility: { motor: [], audio: [], visual: [], mental: [] },
      specialEventType: null,
    })

    render(reactQueryProviderHOC(<CinemaScreeningDetailsModal />))

    await user.press(await screen.findByText('Fermer'))

    expect(goBack).toHaveBeenCalledTimes(1)
  })
})
