import React from 'react'
import { Share } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { BookingCancellationReasons } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { Booking } from 'features/bookings/types'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { EndedBookingItem } from './EndedBookingItem'

const mockNativeShare = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction })

describe('EndedBookingItem', () => {
  it('should display offer title', () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderEndedBookingItem(bookingsSnap.ended_bookings[0])

    expect(screen.queryByText('Avez-vous déjà vu ?')).toBeOnTheScreen()
  })

  it('should display "Réservation utilisée" and dateUsed labels if booking was used', () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      dateUsed: '2021-03-16T23:01:37.925926',
    })

    expect(screen.queryByText('Réservation utilisée')).toBeOnTheScreen()
    expect(screen.queryByText('le 16/03/2021')).toBeOnTheScreen()
  })

  it('should display "Annulée" and cancellationDate labels if booking was cancelled by offerer', () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationReason: BookingCancellationReasons.OFFERER,
    })

    expect(screen.queryByText('Annulée')).toBeOnTheScreen()
    expect(screen.queryByText('le 15/03/2021')).toBeOnTheScreen()
  })

  it('should display "Réservation annulée" and cancellationDate labels if booking was cancelled by beneficiary and offer is not digital without expiration date', () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationReason: BookingCancellationReasons.BENEFICIARY,
    })

    expect(screen.queryByText('Réservation annulée')).toBeOnTheScreen()
    expect(screen.queryByText('le 15/03/2021')).toBeOnTheScreen()
  })

  it('should display "Réservation annulée" and cancellationDate labels if booking was expired and offer is not digital without expiration date', () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationReason: BookingCancellationReasons.EXPIRED,
    })

    expect(screen.queryByText('Réservation annulée')).toBeOnTheScreen()
    expect(screen.queryByText('le 15/03/2021')).toBeOnTheScreen()
  })

  it('should display "Réservation archivée" when offer is digital without expiration date and not cancelled', () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationDate: null,
      cancellationReason: null,
    })

    expect(screen.queryByText('Réservation archivée')).toBeOnTheScreen()
  })

  it('should navigate to offer page when offer is not digital without expiration date', async () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      stock: {
        // @ts-expect-error: because of noUncheckedIndexedAccess
        ...bookingsSnap.ended_bookings[0].stock,
        // @ts-expect-error: because of noUncheckedIndexedAccess
        offer: { ...bookingsSnap.ended_bookings[0].stock.offer, isDigital: false },
      },
    })

    const item = screen.getByText('Réservation annulée')
    fireEvent.press(item)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Offer', {
        id: 147874,
        from: 'endedbookings',
      })
      expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
        offerId: 147874,
        from: 'endedbookings',
      })
    })
  })

  it('should navigate to the booking details page when offer is digital without expiration date and not cancelled', async () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationDate: null,
      cancellationReason: null,
    })

    const item = screen.getByText('Réservation archivée')
    fireEvent.press(item)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('BookingDetails', {
        id: 321,
      })
    })
  })

  it('should call share when press share icon', async () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationDate: null,
      cancellationReason: null,
    })

    const shareButton = await screen.findByLabelText(
      // @ts-expect-error: because of noUncheckedIndexedAccess
      `Partager l’offre ${bookingsSnap.ended_bookings[0].stock.offer.name}`
    )
    fireEvent.press(shareButton)

    expect(mockNativeShare).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when press share icon', async () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationDate: null,
      cancellationReason: null,
    })

    const shareButton = await screen.findByLabelText(
      // @ts-expect-error: because of noUncheckedIndexedAccess
      `Partager l’offre ${bookingsSnap.ended_bookings[0].stock.offer.name}`
    )
    fireEvent.press(shareButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Offer',
      from: 'endedbookings',
      // @ts-expect-error: because of noUncheckedIndexedAccess
      offerId: bookingsSnap.ended_bookings[0].stock.offer.id,
    })
  })
})

function renderEndedBookingItem(booking: Booking) {
  return render(reactQueryProviderHOC(<EndedBookingItem booking={booking} />))
}
