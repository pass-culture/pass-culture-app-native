import React from 'react'
import { Share } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { BookingCancellationReasons, ReactionTypeEnum } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { Booking } from 'features/bookings/types'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

import { EndedBookingItem } from './EndedBookingItem'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('libs/network/NetInfoWrapper')

const mockNativeShare = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction })

jest.mock('libs/firebase/analytics/analytics')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('EndedBookingItem', () => {
  it('should display offer title', () => {
    renderEndedBookingItem(bookingsSnap.ended_bookings[0])

    expect(screen.getByText('Avez-vous déjà vu ?')).toBeOnTheScreen()
  })

  it('should display "Réservation utilisée" and dateUsed labels if booking was used', () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      dateUsed: '2021-03-16T23:01:37.925926',
    })

    expect(screen.getByText('Réservation utilisée')).toBeOnTheScreen()
    expect(screen.getByText('le 16/03/2021')).toBeOnTheScreen()
  })

  it('should display "Annulée" and cancellationDate labels if booking was cancelled by offerer', () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationReason: BookingCancellationReasons.OFFERER,
    })

    expect(screen.getByText('Annulée')).toBeOnTheScreen()
    expect(screen.getByText('le 15/03/2021')).toBeOnTheScreen()
  })

  it('should display "Réservation annulée" and cancellationDate labels if booking was cancelled by beneficiary and offer is not digital without expiration date', () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationReason: BookingCancellationReasons.BENEFICIARY,
    })

    expect(screen.getByText('Réservation annulée')).toBeOnTheScreen()
    expect(screen.getByText('le 15/03/2021')).toBeOnTheScreen()
  })

  it('should display "Réservation annulée" and cancellationDate labels if booking was expired and offer is not digital without expiration date', () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationReason: BookingCancellationReasons.EXPIRED,
    })

    expect(screen.getByText('Réservation annulée')).toBeOnTheScreen()
    expect(screen.getByText('le 15/03/2021')).toBeOnTheScreen()
  })

  it('should display "Réservation archivée" when offer is digital without expiration date and not cancelled', () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationDate: null,
      cancellationReason: null,
    })

    expect(screen.getByText('Réservation archivée')).toBeOnTheScreen()
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
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationDate: null,
      cancellationReason: null,
    })

    const shareButton = await screen.findByLabelText(
      `Partager l’offre ${bookingsSnap.ended_bookings[0].stock.offer.name}`
    )
    fireEvent.press(shareButton)

    expect(mockNativeShare).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when press share icon', async () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationDate: null,
      cancellationReason: null,
    })

    const shareButton = await screen.findByLabelText(
      `Partager l’offre ${bookingsSnap.ended_bookings[0].stock.offer.name}`
    )
    fireEvent.press(shareButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Offer',
      from: 'endedbookings',

      offerId: bookingsSnap.ended_bookings[0].stock.offer.id,
    })
  })

  describe('when reaction feature flag is activated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
    })

    it('should display reaction button', () => {
      renderEndedBookingItem(bookingsSnap.ended_bookings[0])

      expect(screen.getByLabelText('Réagis à ta réservation')).toBeOnTheScreen()
    })

    it.each([
      [ReactionTypeEnum.LIKE, /tu as liké/],
      [ReactionTypeEnum.DISLIKE, /tu as disliké/],
      [ReactionTypeEnum.NO_REACTION, /tu n’as pas souhaité réagir/],
    ])(
      'should display correct icon and correct a11y label when data has reaction %s',
      async (userReaction, labelRegex) => {
        renderEndedBookingItem({
          ...bookingsSnap.ended_bookings[0],
          userReaction,
        })

        expect(screen.getByLabelText(labelRegex)).toBeOnTheScreen()
      }
    )

    it('should open reaction modal on press', () => {
      const mockShowModal = jest.fn()
      jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
        visible: false,
        showModal: mockShowModal,
        hideModal: jest.fn(),
        toggleModal: jest.fn(),
      })

      renderEndedBookingItem(bookingsSnap.ended_bookings[0])

      fireEvent.press(screen.getByLabelText('Réagis à ta réservation'))

      expect(mockShowModal).toHaveBeenCalledWith()
    })
  })
})

function renderEndedBookingItem(booking: Booking) {
  return render(reactQueryProviderHOC(<EndedBookingItem booking={booking} />))
}
