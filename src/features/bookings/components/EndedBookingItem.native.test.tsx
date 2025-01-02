import React, { Fragment, FunctionComponent } from 'react'
import { Share } from 'react-native'

import { CategoryIdEnum, NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { Booking } from 'features/bookings/types'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteConfigProvider } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

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

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const mockHandleShowReactionModal = jest.fn()
const mockHandleShowShareOfferModal = jest.fn()

const user = userEvent.setup()

describe('EndedBookingItem', () => {
  jest.useFakeTimers()

  it('should display offer title', () => {
    renderEndedBookingItem(bookingsSnap.ended_bookings[0])

    expect(screen.getByText('Avez-vous déjà vu ?')).toBeOnTheScreen()
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
    await user.press(item)

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
    await userEvent.press(item)

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
    await user.press(item)

    expect(mockNavigate).toHaveBeenCalledWith('BookingDetails', {
      id: 321,
    })
  })

  it('should log logViewedBookingPage when click on offer digital without expiration date and not cancelled', async () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationDate: null,
      cancellationReason: null,
    })

    const item = screen.getByText('Réservation archivée')
    await user.press(item)

    expect(analytics.logViewedBookingPage).toHaveBeenCalledWith({
      offerId: bookingsSnap.ended_bookings[0].stock.offer.id,
      from: 'endedbookings',
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
    await user.press(shareButton)

    expect(mockNativeShare).toHaveBeenCalledTimes(1)
  })

  it('should handle share offer modal opening when pressing share icon', async () => {
    renderEndedBookingItem({
      ...bookingsSnap.ended_bookings[0],
      cancellationDate: null,
      cancellationReason: null,
    })

    const shareButton = await screen.findByLabelText(
      `Partager l’offre ${bookingsSnap.ended_bookings[0].stock.offer.name}`
    )
    await user.press(shareButton)

    expect(mockHandleShowShareOfferModal).toHaveBeenCalledTimes(1)
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
    await user.press(shareButton)

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

    it('should handle reaction modal opening when pressing reaction button', async () => {
      renderEndedBookingItem(bookingsSnap.ended_bookings[1], RemoteConfigProvider)

      await user.press(await screen.findByLabelText('Réagis à ta réservation'))

      expect(mockHandleShowReactionModal).toHaveBeenCalledTimes(1)
    })
  })
})

function renderEndedBookingItem(
  booking: Booking,
  Wrapper: FunctionComponent<{ children: JSX.Element }> = Fragment
) {
  return render(
    <Wrapper>
      {reactQueryProviderHOC(
        <EndedBookingItem
          booking={booking}
          handleShowReactionModal={mockHandleShowReactionModal}
          handleShowShareOfferModal={mockHandleShowShareOfferModal}
        />
      )}
    </Wrapper>
  )
}
