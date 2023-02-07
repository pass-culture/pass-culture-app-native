import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { BookingCancellationReasons } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { Booking } from 'features/bookings/types'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen } from 'tests/utils'

import { EndedBookingItem } from './EndedBookingItem'

jest.mock('react-query')

describe('EndedBookingItem', () => {
  it('should display offer title', () => {
    renderEndedBookingItem(bookingsSnap.ended_bookings[0])
    expect(screen.queryByText('Avez-vous déjà vu ?')).toBeTruthy()
  })

  it('should display "Réservation utilisée" and dateUsed labels if booking was used', () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      dateUsed: '2021-03-16T23:01:37.925926',
    })
    expect(screen.queryByText('Réservation utilisée')).toBeTruthy()
    expect(screen.queryByText('le 16/03/2021')).toBeTruthy()
  })

  it('should display "Annulée" and cancellationDate labels if booking was cancelled by offerer', () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationReason: BookingCancellationReasons.OFFERER,
    })
    expect(screen.queryByText('Annulée')).toBeTruthy()
    expect(screen.queryByText('le 15/03/2021')).toBeTruthy()
  })

  it('should display "Réservation annulée" and cancellationDate labels if booking was cancelled by beneficiary and offer is not digital without expiration date', () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationReason: BookingCancellationReasons.BENEFICIARY,
    })
    expect(screen.queryByText('Réservation annulée')).toBeTruthy()
    expect(screen.queryByText('le 15/03/2021')).toBeTruthy()
  })

  it('should display "Réservation annulée" and cancellationDate labels if booking was expired and offer is not digital without expiration date', () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationReason: BookingCancellationReasons.EXPIRED,
    })
    expect(screen.queryByText('Réservation annulée')).toBeTruthy()
    expect(screen.queryByText('le 15/03/2021')).toBeTruthy()
  })

  it('should display "Réservation archivée" when offer is digital without expiration date and not cancelled', () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationDate: null,
      cancellationReason: null,
    })
    expect(screen.queryByText('Réservation archivée')).toBeTruthy()
  })

  it('should navigate to offer page when offer is not digital without expiration date', async () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      stock: {
        ...bookingsSnap.ended_bookings[0].stock,
        offer: { ...bookingsSnap.ended_bookings[0].stock.offer, isDigital: false },
      },
    })

    const item = screen.getByText('Réservation annulée')
    await fireEvent.press(item)

    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: 147874,
      from: 'endedbookings',
    })
    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      offerId: 147874,
      from: 'endedbookings',
    })
  })

  it('should navigate to the booking details page when offer is digital without expiration date and not cancelled', async () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationDate: null,
      cancellationReason: null,
    })

    const item = screen.getByText('Réservation archivée')
    await fireEvent.press(item)

    expect(navigate).toHaveBeenCalledWith('BookingDetails', {
      id: 321,
    })
  })
})

function renderEndedBookingItem(booking: Booking) {
  return render(<EndedBookingItem booking={booking} />)
}
