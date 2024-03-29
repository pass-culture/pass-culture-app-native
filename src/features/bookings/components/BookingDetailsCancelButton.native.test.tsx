import mockdate from 'mockdate'
import React from 'react'

import { SubcategoryIdEnum } from 'api/gen'
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
const mockedIsUserExBeneficiary = jest.mocked(isUserExBeneficiary)

describe('<BookingDetailsCancelButton />', () => {
  it('should display the "Terminer" button for digital offers when booking has activation code', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    // @ts-expect-error: because of noUncheckedIndexedAccess
    booking.stock.offer.isDigital = true
    booking.activationCode = {
      code: 'someCode',
    }
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderBookingDetailsCancelButton(booking)

    expect(screen.getByTestId('Terminer')).toBeOnTheScreen()
  })

  it('should display button if confirmationDate is null', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    booking.confirmationDate = null
    // @ts-expect-error: because of noUncheckedIndexedAccess
    booking.stock.offer.isDigital = false
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderBookingDetailsCancelButton(booking)

    expect(screen.getByTestId('Annuler ma réservation')).toBeOnTheScreen()
  })

  it('should display button if confirmation date is not expired', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    const date = new Date()
    date.setDate(date.getDate() + 1)
    booking.confirmationDate = date.toISOString()
    // @ts-expect-error: because of noUncheckedIndexedAccess
    booking.stock.offer.isDigital = false
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderBookingDetailsCancelButton(booking)

    expect(screen.getByTestId('Annuler ma réservation')).toBeOnTheScreen()
  })

  it('should not display button if confirmation date is expired', async () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    // @ts-expect-error: because of noUncheckedIndexedAccess
    booking.stock.offer.isPermanent = false
    booking.confirmationDate = '2020-03-15T23:01:37.925926'
    // @ts-expect-error: because of noUncheckedIndexedAccess
    booking.stock.offer.isDigital = false
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderBookingDetailsCancelButton(booking)

    expect(screen.queryByTestId('Annuler ma réservation')).not.toBeOnTheScreen()
  })

  it('should call onCancel', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    const date = new Date()
    date.setDate(date.getDate() + 1)
    booking.confirmationDate = date.toISOString()
    // @ts-expect-error: because of noUncheckedIndexedAccess
    booking.stock.offer.isDigital = false
    const onCancel = jest.fn()
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderBookingDetailsCancelButton(booking, {
      onCancel,
    })
    const button = screen.getByTestId('Annuler ma réservation')
    fireEvent.press(button)

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should call onTerminate', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0], activationCode: { code: 'someCode' } }
    // @ts-expect-error: because of noUncheckedIndexedAccess
    booking.stock.offer.isDigital = false
    const onTerminate = jest.fn()
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderBookingDetailsCancelButton(booking, {
      onTerminate,
    })
    const button = screen.getByTestId('Terminer')
    fireEvent.press(button)

    expect(onTerminate).toHaveBeenCalledTimes(1)
  })

  it('should block user if cancellation date is over', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    booking.confirmationDate = '2020-11-01T00:00:00Z'
    // @ts-expect-error: because of noUncheckedIndexedAccess
    booking.stock.offer.isDigital = false
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderBookingDetailsCancelButton(booking)

    expect(
      screen.getByText(
        'Tu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le\u00a01 novembre 2020'
      )
    ).toBeOnTheScreen()
  })

  it('should block user if cancellation date is over and user is ex beneficiary', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    booking.confirmationDate = '2020-11-01T00:00:00Z'
    // @ts-expect-error: because of noUncheckedIndexedAccess
    booking.stock.offer.isDigital = false
    mockedIsUserExBeneficiary.mockReturnValueOnce(true)
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderBookingDetailsCancelButton(booking)

    expect(
      screen.getByText(
        'Ton crédit est expiré.\nTu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le 1 novembre 2020'
      )
    ).toBeOnTheScreen()
  })

  it("should display cancel button and expiration date message when confirmation date is null and that's it a digital booking", () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    booking.confirmationDate = null
    // @ts-expect-error: because of noUncheckedIndexedAccess
    booking.stock.offer.isDigital = true

    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderBookingDetailsCancelButton(booking)
    const expirationDateMessage = 'Ta réservation sera archivée le 17/03/2021'

    expect(screen.getByTestId('Annuler ma réservation')).toBeOnTheScreen()
    expect(screen.getByText(expirationDateMessage)).toBeOnTheScreen()
  })

  it('should display only an expiration date message when the booking is digital and is not still cancellable', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    booking.confirmationDate = '2020-11-01T00:00:00Z'

    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderBookingDetailsCancelButton(booking)
    const expirationDateMessage =
      'Tu ne peux plus annuler ta réservation. Elle expirera automatiquement le 17/03/2021'

    expect(screen.getByText(expirationDateMessage)).toBeOnTheScreen()
  })

  it('should not display any message if there is no confirmation date', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    booking.confirmationDate = null

    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderBookingDetailsCancelButton(booking)

    expect(screen.queryByTestId('cancel-annulation-message')).not.toBeOnTheScreen()
  })

  describe("When it's an offer category to archive and it's not free", () => {
    it('should not display expiration date message', () => {
      const booking = { ...bookingsSnap.ongoing_bookings[0] }
      booking.confirmationDate = null
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.offer.isDigital = false
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE

      // @ts-expect-error: because of noUncheckedIndexedAccess
      renderBookingDetailsCancelButton(booking)

      expect(screen.queryByText('Ta réservation sera archivée le 17/03/2021')).not.toBeOnTheScreen()
    })

    it('should display cancel button', () => {
      const booking = { ...bookingsSnap.ongoing_bookings[0] }
      booking.confirmationDate = null
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.offer.isDigital = false
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE

      // @ts-expect-error: because of noUncheckedIndexedAccess
      renderBookingDetailsCancelButton(booking)

      expect(screen.getByTestId('Annuler ma réservation')).toBeOnTheScreen()
    })
  })

  describe("When it's a free offer category to archieve", () => {
    it('should display expiration date message when current price and price at booking time is 0', () => {
      const booking = { ...bookingsSnap.ongoing_bookings[0] }
      booking.confirmationDate = null
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.offer.isDigital = false
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.price = 0
      booking.totalAmount = 0

      // @ts-expect-error: because of noUncheckedIndexedAccess
      renderBookingDetailsCancelButton(booking)

      expect(screen.getByText('Ta réservation sera archivée le 17/03/2021')).toBeOnTheScreen()
    })

    it('should not display cancel button when current price and price at booking time is 0', () => {
      const booking = { ...bookingsSnap.ongoing_bookings[0] }
      booking.confirmationDate = null
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.offer.isDigital = false
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.price = 0
      booking.totalAmount = 0

      // @ts-expect-error: because of noUncheckedIndexedAccess
      renderBookingDetailsCancelButton(booking)

      expect(screen.queryByTestId('Annuler ma réservation')).not.toBeOnTheScreen()
    })

    it('should display expiration date message when current price > 0 and price at booking is 0', () => {
      const booking = { ...bookingsSnap.ongoing_bookings[0] }
      booking.confirmationDate = null
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.offer.isDigital = false
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.price = 1000
      booking.totalAmount = 0

      // @ts-expect-error: because of noUncheckedIndexedAccess
      renderBookingDetailsCancelButton(booking)

      expect(screen.getByText('Ta réservation sera archivée le 17/03/2021')).toBeOnTheScreen()
    })

    it('should not display cancel button when current price > 0 and price at booking is 0', () => {
      const booking = { ...bookingsSnap.ongoing_bookings[0] }
      booking.confirmationDate = null
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.offer.isDigital = false
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.offer.subcategoryId = SubcategoryIdEnum.CARTE_MUSEE
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.stock.price = 1000
      booking.totalAmount = 0

      // @ts-expect-error: because of noUncheckedIndexedAccess
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
