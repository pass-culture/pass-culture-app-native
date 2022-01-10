import mockdate from 'mockdate'
import React from 'react'
import { mocked } from 'ts-jest/utils'

import {
  BookingDetailsCancelButton,
  BookingDetailsCancelButtonProps,
} from 'features/bookings/components/BookingDetailsCancelButton'
import { isUserExBeneficiary } from 'features/profile/utils'
import { fireEvent, render } from 'tests/utils'

import { bookingsSnap } from '../api/bookingsSnap'

import { Booking } from './types'

mockdate.set(new Date('2020-12-01T00:00:00Z'))

jest.mock('features/home/api')
jest.mock('features/home/services/useAvailableCredit')
jest.mock('features/profile/utils')
const mockedisUserExBeneficiary = mocked(isUserExBeneficiary, true)

describe('<BookingDetailsCancelButton />', () => {
  it('should display the "Terminer" button for digital offers when autoActivateDigitalBookings is true', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    booking.stock.offer.isDigital = true
    booking.activationCode = {
      code: 'someCode',
    }
    const { getByTestId } = renderBookingDetailsCancelButton(booking, {
      activationCodeFeatureEnabled: true,
    })
    getByTestId('Terminer')
  })
  it('should display button if confirmationDate is null', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    booking.confirmationDate = null
    const { getByTestId } = renderBookingDetailsCancelButton(booking)
    getByTestId('Annuler ma réservation')
  })

  it('should display button if confirmation date is not expired', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    const date = new Date()
    date.setDate(date.getDate() + 1)
    booking.confirmationDate = date.toISOString()
    const { getByTestId } = renderBookingDetailsCancelButton(booking)
    getByTestId('Annuler ma réservation')
  })

  it('should not display button if confirmation date is expired', async () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    booking.stock.offer.isPermanent = false
    booking.confirmationDate = '2020-03-15T23:01:37.925926'
    const { queryByTestId } = renderBookingDetailsCancelButton(booking)
    expect(queryByTestId('Annuler ma réservation')).toBeFalsy()
  })

  it('should call onCancel', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    const date = new Date()
    date.setDate(date.getDate() + 1)
    booking.confirmationDate = date.toISOString()
    const onCancel = jest.fn()
    const { getByTestId } = renderBookingDetailsCancelButton(booking, {
      onCancel,
    })
    const button = getByTestId('Annuler ma réservation')
    fireEvent.press(button)

    expect(onCancel).toBeCalled()
  })
  it('should call onTerminate', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0], activationCode: { code: 'someCode' } }
    const onTerminate = jest.fn()
    const { getByTestId } = renderBookingDetailsCancelButton(booking, {
      activationCodeFeatureEnabled: true,
      onTerminate,
    })
    const button = getByTestId('Terminer')
    fireEvent.press(button)

    expect(onTerminate).toBeCalled()
  })
  it('should block user if cancellation date is over', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    booking.confirmationDate = '2020-11-01T00:00:00Z'
    const { getByText } = renderBookingDetailsCancelButton(booking)
    getByText(
      'Tu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le\u00a01 novembre 2020'
    )
  })
  it('should block user if cancellation date is over and user is ex beneficiary ', () => {
    const booking = { ...bookingsSnap.ongoing_bookings[0] }
    booking.confirmationDate = '2020-11-01T00:00:00Z'
    mockedisUserExBeneficiary.mockReturnValueOnce(true)
    const { getByText } = renderBookingDetailsCancelButton(booking)
    getByText(
      'Ton crédit est expiré.\nTu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le 1 novembre 2020'
    )
  })
})

function renderBookingDetailsCancelButton(
  booking: Booking,
  props?: Omit<BookingDetailsCancelButtonProps, 'booking'>
) {
  return render(<BookingDetailsCancelButton booking={booking} {...props} />)
}
