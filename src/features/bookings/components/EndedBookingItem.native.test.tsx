import React, { Fragment, FunctionComponent } from 'react'
import { Share } from 'react-native'

import {
  BookingCancellationReasons,
  CategoryIdEnum,
  NativeCategoryIdEnumv2,
  ReactionTypeEnum,
  SubcategoryIdEnum,
} from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { Booking } from 'features/bookings/types'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteConfigProvider } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'

import { EndedBookingItem } from './EndedBookingItem'

const mockGetConfigValues = jest.fn()
jest.mock('libs/firebase/remoteConfig/remoteConfig.services', () => ({
  remoteConfig: {
    configure: () => Promise.resolve(true),
    refresh: () => Promise.resolve(true),
    getValues: () => mockGetConfigValues(),
  },
}))

jest.mock('libs/network/NetInfoWrapper')

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, push: jest.fn() }),
}))

jest.mock('libs/subcategories/useSubcategory')

const mockUseSubcategoriesMapping = jest.fn()
jest.mock('libs/subcategories/mappings', () => ({
  useSubcategoriesMapping: jest.fn(() => mockUseSubcategoriesMapping()),
}))
mockUseSubcategoriesMapping.mockReturnValue({
  [SubcategoryIdEnum.SEANCE_CINE]: {
    isEvent: false,
    categoryId: CategoryIdEnum.CINEMA,
    nativeCategoryId: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
  },
  [SubcategoryIdEnum.EVENEMENT_PATRIMOINE]: {
    isEvent: false,
    categoryId: CategoryIdEnum.CONFERENCE,
    nativeCategoryId: NativeCategoryIdEnumv2.EVENEMENTS_PATRIMOINE,
  },
})

const mockNativeShare = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction })

jest.mock('libs/firebase/analytics/analytics')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('EndedBookingItem', () => {
  jest.useFakeTimers()

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
    userEvent.press(item)

    await screen.findByText('Avez-vous déjà vu ?')

    expect(mockNavigate).toHaveBeenCalledWith('Offer', {
      id: 147874,
      from: 'endedbookings',
    })
  })

  it('should call analytics logConsultOffer when offer is not digital without expiration date', async () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      stock: {
        ...bookingsSnap.ended_bookings[0].stock,

        offer: { ...bookingsSnap.ended_bookings[0].stock.offer, isDigital: false },
      },
    })

    const item = screen.getByText('Réservation annulée')
    userEvent.press(item)

    await screen.findByText('Avez-vous déjà vu ?')

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
    fireEvent.press(item)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('BookingDetails', {
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
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(true)
      mockGetConfigValues.mockReturnValue({
        reactionCategories: { categories: ['SEANCES_DE_CINEMA'] },
      })
    })

    it('should display reaction button', async () => {
      renderEndedBookingItem(bookingsSnap.ended_bookings[1], RemoteConfigProvider)

      expect(await screen.findByLabelText('Réagis à ta réservation')).toBeOnTheScreen()
    })

    it('should not display reaction button when category is not in remoteConfig param', async () => {
      mockGetConfigValues.mockReturnValueOnce({
        reactionCategories: { categories: ['THEATRE'] },
      })
      renderEndedBookingItem(bookingsSnap.ended_bookings[1], RemoteConfigProvider)

      await screen.findByText('Réservation utilisée')

      expect(screen.queryByLabelText('Réagis à ta réservation')).not.toBeOnTheScreen()
    })

    it.each([
      [ReactionTypeEnum.LIKE, /tu as liké/],
      [ReactionTypeEnum.DISLIKE, /tu as disliké/],
      [ReactionTypeEnum.NO_REACTION, /tu n’as pas souhaité réagir/],
    ])(
      'should display correct icon and correct a11y label when data has reaction %s',
      async (userReaction, labelRegex) => {
        renderEndedBookingItem(
          {
            ...bookingsSnap.ended_bookings[1],
            userReaction,
          },
          RemoteConfigProvider
        )

        expect(await screen.findByLabelText(labelRegex)).toBeOnTheScreen()
      }
    )

    it('should display a small badge when offer is waiting for a reaction', async () => {
      renderEndedBookingItem(
        {
          ...bookingsSnap.ended_bookings[1],
          userReaction: null,
        },
        RemoteConfigProvider
      )

      expect(await screen.findByTestId('smallBadge')).toBeOnTheScreen()
    })

    it('should open reaction modal on press', async () => {
      renderEndedBookingItem(bookingsSnap.ended_bookings[1], RemoteConfigProvider)

      fireEvent.press(await screen.findByLabelText('Réagis à ta réservation'))

      expect(await screen.findByLabelText('Valider la réaction')).toBeOnTheScreen()
    })
  })
})

function renderEndedBookingItem(
  booking: Booking,
  Wrapper: FunctionComponent<{ children: JSX.Element }> = Fragment
) {
  return render(<Wrapper>{reactQueryProviderHOC(<EndedBookingItem booking={booking} />)}</Wrapper>)
}
