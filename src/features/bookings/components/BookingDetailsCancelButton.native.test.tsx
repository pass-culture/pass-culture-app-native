import mockdate from 'mockdate'
import React from 'react'

import { BookingReponse, SubcategoryIdEnum } from 'api/gen'
import type { BookingsResponse } from 'api/gen'
import {
  BookingDetailsCancelButton,
  BookingDetailsCancelButtonProps,
} from 'features/bookings/components/BookingDetailsCancelButton'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { Booking } from 'features/bookings/types'
import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { fireEvent, render, screen } from 'tests/utils'

mockdate.set(new Date('2020-12-01T00:00:00Z'))

jest.mock('shared/user/useAvailableCredit')
jest.mock('features/auth/context/AuthContext')
jest.mock('features/profile/helpers/isUserExBeneficiary')
jest.mock('libs/subcategories/useSubcategory')
const mockedIsUserExBeneficiary = jest.mocked(isUserExBeneficiary)

describe('<BookingDetailsCancelButton />', () => {
  it('should display the "Terminer" button for digital offers when booking has activation code', () => {
    const booking: BookingsResponse['ongoing_bookings'][number] = {
      ...bookingsSnap.ongoing_bookings[0],
    }
    booking.stock.offer.isDigital = true
    booking.activationCode = {
      code: 'someCode',
    }
    renderBookingDetailsCancelButton(booking)

    expect(screen.getByTestId('Terminer')).toBeOnTheScreen()
  })

  it('should display button if confirmationDate is null', () => {
    const booking: BookingReponse = {
      ...bookingsSnap.ongoing_bookings[0],
    }
    booking.confirmationDate = null
    booking.stock.offer.isDigital = false
    renderBookingDetailsCancelButton(booking)

    expect(screen.getByTestId('Annuler ma réservation')).toBeOnTheScreen()
  })

  it('should display button if confirmation date is not expired', () => {
    const booking: BookingsResponse['ongoing_bookings'][number] = {
      ...bookingsSnap.ongoing_bookings[0],
    }
    const date = new Date()
    date.setDate(date.getDate() + 1)
    booking.confirmationDate = date.toISOString()
    booking.stock.offer.isDigital = false
    renderBookingDetailsCancelButton(booking)

    expect(screen.getByTestId('Annuler ma réservation')).toBeOnTheScreen()
  })

  it('should not display button if confirmation date is expired', async () => {
    const booking: BookingsResponse['ongoing_bookings'][number] = {
      ...bookingsSnap.ongoing_bookings[0],
    }
    booking.stock.offer.isPermanent = false
    booking.confirmationDate = '2020-03-15T23:01:37.925926'
    booking.stock.offer.isDigital = false
    renderBookingDetailsCancelButton(booking)

    expect(screen.queryByTestId('Annuler ma réservation')).not.toBeOnTheScreen()
  })

  it('should call onCancel', () => {
    const booking: BookingsResponse['ongoing_bookings'][number] = {
      ...bookingsSnap.ongoing_bookings[0],
    }
    const date = new Date()
    date.setDate(date.getDate() + 1)
    booking.confirmationDate = date.toISOString()
    booking.stock.offer.isDigital = false
    const onCancel = jest.fn()
    renderBookingDetailsCancelButton(booking, {
      onCancel,
    })
    const button = screen.getByTestId('Annuler ma réservation')
    fireEvent.press(button)

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should call onTerminate', () => {
    const booking: BookingsResponse['ongoing_bookings'][number] = {
      ...bookingsSnap.ongoing_bookings[0],
      activationCode: { code: 'someCode' },
    }
    booking.stock.offer.isDigital = false
    const onTerminate = jest.fn()
    renderBookingDetailsCancelButton(booking, {
      onTerminate,
    })
    const button = screen.getByTestId('Terminer')
    fireEvent.press(button)

    expect(onTerminate).toHaveBeenCalledTimes(1)
  })

  it('should block user if cancellation date is over', () => {
    const booking: BookingsResponse['ongoing_bookings'][number] = {
      ...bookingsSnap.ongoing_bookings[0],
    }
    booking.confirmationDate = '2020-11-01T00:00:00Z'
    booking.stock.offer.isDigital = false
    renderBookingDetailsCancelButton(booking)

    expect(
      screen.getByText(
        'Tu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le\u00a01 novembre 2020'
      )
    ).toBeOnTheScreen()
  })

  it('should block user if cancellation date is over and user is ex beneficiary', () => {
    const booking: BookingsResponse['ongoing_bookings'][number] = {
      ...bookingsSnap.ongoing_bookings[0],
    }
    booking.confirmationDate = '2020-11-01T00:00:00Z'
    booking.stock.offer.isDigital = false
    mockedIsUserExBeneficiary.mockReturnValueOnce(true)
    renderBookingDetailsCancelButton(booking)

    expect(
      screen.getByText(
        'Ton crédit est expiré.\nTu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le 1 novembre 2020'
      )
    ).toBeOnTheScreen()
  })

  it("should display cancel button and expiration date message when confirmation date is null and that's it a digital booking", () => {
    const booking: BookingsResponse['ongoing_bookings'][number] = {
      ...bookingsSnap.ongoing_bookings[0],
    }
    booking.confirmationDate = null
    booking.stock.offer.isDigital = true

    renderBookingDetailsCancelButton(booking)
    const expirationDateMessage = 'Ta réservation sera archivée le 17/03/2021'

    expect(screen.getByTestId('Annuler ma réservation')).toBeOnTheScreen()
    expect(screen.getByText(expirationDateMessage)).toBeOnTheScreen()
  })

  it('should display only an expiration date message when the booking is digital and is not still cancellable', () => {
    const booking: BookingsResponse['ongoing_bookings'][number] = {
      ...bookingsSnap.ongoing_bookings[0],
    }
    booking.confirmationDate = '2020-11-01T00:00:00Z'

    renderBookingDetailsCancelButton(booking)
    const expirationDateMessage =
      'Tu ne peux plus annuler ta réservation. Elle expirera automatiquement le 17/03/2021'

    expect(screen.getByText(expirationDateMessage)).toBeOnTheScreen()
  })

  it('should not display any message if there is no confirmation date', () => {
    const booking: BookingsResponse['ongoing_bookings'][number] = {
      ...bookingsSnap.ongoing_bookings[0],
    }
    booking.confirmationDate = null

    renderBookingDetailsCancelButton(booking)

    expect(screen.queryByTestId('cancel-annulation-message')).not.toBeOnTheScreen()
  })

  describe("When it's an offer category to archive and it's not free", () => {
    it('should not display expiration date message', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = {
        ...bookingsSnap.ongoing_bookings[0],
      }
      booking.confirmationDate = null

      booking.stock.offer.isDigital = false

      booking.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE

      renderBookingDetailsCancelButton(booking)

      expect(screen.queryByText('Ta réservation sera archivée le 17/03/2021')).not.toBeOnTheScreen()
    })

    it('should display cancel button', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = {
        ...bookingsSnap.ongoing_bookings[0],
      }
      booking.confirmationDate = null

      booking.stock.offer.isDigital = false

      booking.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE

      renderBookingDetailsCancelButton(booking)

      expect(screen.getByTestId('Annuler ma réservation')).toBeOnTheScreen()
    })
  })

  describe("When it's a free offer category to archieve", () => {
    it('should display expiration date message when current price and price at booking time is 0', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = {
        ...bookingsSnap.ongoing_bookings[0],
      }
      booking.confirmationDate = null

      booking.stock.offer.isDigital = false

      booking.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE

      booking.stock.price = 0
      booking.totalAmount = 0

      renderBookingDetailsCancelButton(booking)

      expect(screen.getByText('Ta réservation sera archivée le 17/03/2021')).toBeOnTheScreen()
    })

    it('should not display cancel button when current price and price at booking time is 0', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = {
        ...bookingsSnap.ongoing_bookings[0],
      }
      booking.confirmationDate = null

      booking.stock.offer.isDigital = false

      booking.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE

      booking.stock.price = 0
      booking.totalAmount = 0

      renderBookingDetailsCancelButton(booking)

      expect(screen.queryByTestId('Annuler ma réservation')).not.toBeOnTheScreen()
    })

    it('should display expiration date message when current price > 0 and price at booking is 0', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = {
        ...bookingsSnap.ongoing_bookings[0],
      }
      booking.confirmationDate = null

      booking.stock.offer.isDigital = false

      booking.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE

      booking.stock.price = 1000
      booking.totalAmount = 0

      renderBookingDetailsCancelButton(booking)

      expect(screen.getByText('Ta réservation sera archivée le 17/03/2021')).toBeOnTheScreen()
    })

    it('should not display cancel button when current price > 0 and price at booking is 0', () => {
      const booking: BookingsResponse['ongoing_bookings'][number] = {
        ...bookingsSnap.ongoing_bookings[0],
      }
      booking.confirmationDate = null

      booking.stock.offer.isDigital = false

      booking.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE

      booking.stock.price = 1000
      booking.totalAmount = 0

      renderBookingDetailsCancelButton(booking)

      expect(screen.queryByTestId('Annuler ma réservation')).not.toBeOnTheScreen()
    })
  })
})

function renderBookingDetailsCancelButton(
  booking: Booking,
  props?: Omit<BookingDetailsCancelButtonProps, 'booking'>
) {
  return render(<BookingDetailsCancelButton booking={booking} {...props} />)
}
