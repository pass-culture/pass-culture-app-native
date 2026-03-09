import { useFocusEffect } from '@react-navigation/native'
import React, { PropsWithChildren } from 'react'
import { ThemeProvider } from 'styled-components/native'

import { mockSubcategoriesMapping } from 'features/headlineOffer/fixtures/mockMapping'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferModal } from 'shared/offer/enums'
import { computedTheme } from 'tests/computedTheme'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

import { useOfferCTAs } from './useOfferCTAs'

jest.mock('libs/firebase/analytics/analytics')
const mockSetParams = jest.fn()
const mockUseRoute = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    setParams: mockSetParams,
  }),
  useRoute: () => mockUseRoute(),
  useFocusEffect: jest.fn(),
}))
const mockUseAuthContext = jest.fn().mockReturnValue({ isLoggedIn: true })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))
jest.mock('features/offer/components/OfferContent/OfferCTAProvider', () => ({
  useOfferCTA: () => ({ isButtonVisible: true }),
}))
const mockOnPressCTA = jest.fn()
const mockModalToDisplay = OfferModal.BOOKING
jest.mock('features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction', () => ({
  useCtaWordingAndAction: () => ({
    onPress: mockOnPressCTA,
    modalToDisplay: mockModalToDisplay,
  }),
}))
const mockAddReminder = jest.fn()
jest.mock('features/offer/queries/useAddReminderMutation', () => ({
  useAddReminderMutation: () => ({ mutate: mockAddReminder }),
}))
jest.mock('features/offer/queries/useDeleteReminderMutation', () => ({
  useDeleteReminderMutation: () => ({ mutate: jest.fn() }),
}))
const mockShowOfferModal = jest.fn()
jest.mock('shared/offer/helpers/useBookOfferModal', () => ({
  useBookOfferModal: () => ({
    OfferModal: null,
    showModal: mockShowOfferModal,
    modalToDisplay: true,
  }),
}))

const mockShowModal = jest.fn()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
  }),
}))

const mockUseFocusEffect = useFocusEffect as jest.Mock

const mockFavoriteCTAProps = {
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
  favorite: null,
  isAddFavoriteLoading: false,
  isRemoveFavoriteLoading: false,
}

const wrapper = ({ children }: PropsWithChildren) =>
  React.createElement(ThemeProvider, { theme: computedTheme }, reactQueryProviderHOC(children))
const mockTrackEvent = jest.fn()

describe('useOfferCTAs hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRoute.mockReturnValue({ params: {} })
    mockUseFocusEffect.mockImplementation((callback) => {
      callback()
    })
  })

  describe('Focus Effects & Tracking', () => {
    it('should call trackEventHasSeenOfferOnce on focus', () => {
      renderHook(
        () =>
          useOfferCTAs({
            offer: offerResponseSnap,
            subcategory: mockSubcategoriesMapping.SEANCE_CINE,
            trackEventHasSeenOfferOnce: mockTrackEvent,
            favoriteCTAProps: mockFavoriteCTAProps,
          }),
        { wrapper }
      )

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    })

    it('should open modal and clear params if openModalOnNavigation is true', () => {
      mockUseRoute.mockReturnValueOnce({
        params: { openModalOnNavigation: true },
      })
      renderHook(
        () =>
          useOfferCTAs({
            offer: offerResponseSnap,
            subcategory: mockSubcategoriesMapping.SEANCE_CINE,
            trackEventHasSeenOfferOnce: mockTrackEvent,
            favoriteCTAProps: mockFavoriteCTAProps,
          }),
        { wrapper }
      )

      expect(mockShowOfferModal).toHaveBeenCalledTimes(1)
      expect(mockSetParams).toHaveBeenCalledWith({ openModalOnNavigation: undefined })
    })
  })

  describe('Favorites Logic', () => {
    it('should call addFavorite when on favorite press is triggered and no favorite exists', () => {
      const { result } = renderHook(
        () =>
          useOfferCTAs({
            offer: offerResponseSnap,
            subcategory: mockSubcategoriesMapping.SEANCE_CINE,
            trackEventHasSeenOfferOnce: mockTrackEvent,
            favoriteCTAProps: mockFavoriteCTAProps,
          }),
        { wrapper }
      )

      result.current.ctaProps.onFavoritePress()

      expect(mockFavoriteCTAProps.addFavorite).toHaveBeenCalledWith({
        offerId: offerResponseSnap.id,
      })
    })

    it('should call removeFavorite when on favorite press is triggered and favorite exists', () => {
      const favoritePropsWithData = {
        ...mockFavoriteCTAProps,
        favorite: {
          id: 1,
          offer: {
            id: offerResponseSnap.id,
            coordinates: offerResponseSnap.venue.coordinates,
            expenseDomains: offerResponseSnap.expenseDomains,
            isReleased: offerResponseSnap.isReleased,
            name: offerResponseSnap.name,
            subcategoryId: offerResponseSnap.subcategoryId,
            venueName: offerResponseSnap.venue.name,
          },
        },
      }
      const { result } = renderHook(
        () =>
          useOfferCTAs({
            offer: offerResponseSnap,
            subcategory: mockSubcategoriesMapping.SEANCE_CINE,
            trackEventHasSeenOfferOnce: mockTrackEvent,
            favoriteCTAProps: favoritePropsWithData,
          }),
        { wrapper }
      )

      result.current.ctaProps.onFavoritePress()

      expect(mockFavoriteCTAProps.removeFavorite).toHaveBeenCalledWith(1)
    })

    it('should show auth modal on favorite press if user is logged out', () => {
      mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: false })
      const { result } = renderHook(
        () =>
          useOfferCTAs({
            offer: offerResponseSnap,
            subcategory: mockSubcategoriesMapping.SEANCE_CINE,
            trackEventHasSeenOfferOnce: mockTrackEvent,
            favoriteCTAProps: mockFavoriteCTAProps,
          }),
        { wrapper }
      )

      result.current.ctaProps.onFavoritePress()

      expect(mockShowModal).toHaveBeenCalledTimes(1)
      expect(mockFavoriteCTAProps.addFavorite).not.toHaveBeenCalled()
    })
  })

  describe('Reminders Logic', () => {
    it('should call addReminder when on reminder press is triggered and no reminder exists', () => {
      const { result } = renderHook(
        () =>
          useOfferCTAs({
            offer: offerResponseSnap,
            subcategory: mockSubcategoriesMapping.SEANCE_CINE,
            trackEventHasSeenOfferOnce: mockTrackEvent,
            favoriteCTAProps: mockFavoriteCTAProps,
          }),
        { wrapper }
      )

      result.current.ctaProps.onReminderPress()

      expect(mockAddReminder).toHaveBeenCalledWith(offerResponseSnap.id)
    })

    it('should show auth modal on reminder press if user is logged out', () => {
      mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: false })
      const { result } = renderHook(
        () =>
          useOfferCTAs({
            offer: offerResponseSnap,
            subcategory: mockSubcategoriesMapping.SEANCE_CINE,
            trackEventHasSeenOfferOnce: mockTrackEvent,
            favoriteCTAProps: mockFavoriteCTAProps,
          }),
        { wrapper }
      )

      result.current.ctaProps.onReminderPress()

      expect(mockShowModal).toHaveBeenCalledTimes(1)
      expect(mockAddReminder).not.toHaveBeenCalled()
    })
  })

  describe('CTA Button Logic', () => {
    it('should call onPressCTA and showOfferModal when on press is triggered', () => {
      const { result } = renderHook(
        () =>
          useOfferCTAs({
            offer: offerResponseSnap,
            subcategory: mockSubcategoriesMapping.SEANCE_CINE,
            trackEventHasSeenOfferOnce: mockTrackEvent,
            favoriteCTAProps: mockFavoriteCTAProps,
          }),
        { wrapper }
      )

      result.current.ctaProps.onPress()

      expect(mockOnPressCTA).toHaveBeenCalledTimes(1)
      expect(mockShowOfferModal).toHaveBeenCalledTimes(1)
    })
  })
})
