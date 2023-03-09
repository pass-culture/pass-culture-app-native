import React from 'react'

import { OfferResponse } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { mockOffer as baseOffer } from 'features/bookOffer/fixtures/offer'
import { mockStocks } from 'features/bookOffer/fixtures/stocks'
import { IBookingContext } from 'features/bookOffer/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/firebase/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { placeholderData as mockSubcategoriesData } from 'libs/subcategories/placeholderData'
import { cleanup, fireEvent, render, screen } from 'tests/utils'

import { BookingOfferModalComponent } from './BookingOfferModal'

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

const mockOffer: OfferResponse | undefined = baseOffer

const mockUseBookingContext: jest.Mock<IBookingContext> = jest.fn(() => ({
  bookingState: { offerId: mockOffer.id, step: Step.DATE } as BookingState,
  dismissModal: mockDismissModal,
  dispatch: mockDispatch,
}))
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: () => mockUseBookingContext(),
}))

const mockUseOffer = jest.fn()
mockUseOffer.mockReturnValue({
  data: mockOffer,
})
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => mockUseOffer(),
}))

jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: jest.fn(() => mockOffer),
}))

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockSubcategoriesData,
  }),
}))

jest.spyOn(Auth, 'useAuthContext').mockReturnValue({
  isLoggedIn: true,
  user: beneficiaryUser,
  isUserLoading: false,
  refetchUser: jest.fn(),
  setIsLoggedIn: jest.fn(),
}) as jest.Mock

jest.mock('react-query')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

describe('<BookingOfferModalComponent />', () => {
  afterEach(() => {
    cleanup()
  })

  it('should dismiss modal when click on rightIconButton and reset state', () => {
    render(<BookingOfferModalComponent visible offerId={20} />)

    const dismissModalButton = screen.getByTestId('Fermer la modale')

    fireEvent.press(dismissModalButton)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET' })
    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should not log event BookingProcessStart when modal is not visible', () => {
    render(<BookingOfferModalComponent visible={false} offerId={20} />)
    expect(analytics.logBookingProcessStart).not.toHaveBeenCalled()
  })

  it('should log event BookingProcessStart when modal opens', () => {
    const offerId = 30
    render(<BookingOfferModalComponent visible offerId={offerId} />)
    expect(analytics.logBookingProcessStart).toHaveBeenCalledWith(offerId)
  })

  it('should show AlreadyBooked when isEndedUsedBooking is true', () => {
    const offerId = 30
    render(<BookingOfferModalComponent visible offerId={offerId} isEndedUsedBooking />)
    expect(screen.queryByText('Tu as déjà réservé :')).toBeTruthy()
    expect(
      screen.queryByTestId(`Nouvelle fenêtre : Pourquoi limiter les réservations\u00a0?`)
    ).toBeTruthy()
  })

  describe('when offer is duo', () => {
    beforeEach(() => {
      mockUseBookingContext.mockReturnValue({
        bookingState: {
          quantity: 1,
          offerId: mockOffer.id,
          step: Step.CONFIRMATION,
        } as BookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      })
    })
    afterEach(() => {
      cleanup()
    })

    it('should show pre-validation screen when pressing arrow back on confirmation screen', () => {
      render(<BookingOfferModalComponent visible offerId={baseOffer.id} />)

      fireEvent.press(screen.getByTestId('Revenir à l’étape précédente'))

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'CHANGE_STEP',
        payload: Step.PRE_VALIDATION,
      })
    })
  })

  describe('when offer is not duo', () => {
    beforeEach(() => {
      mockUseBookingContext.mockReturnValue({
        bookingState: {
          quantity: 1,
          offerId: mockOffer.id,
          step: Step.CONFIRMATION,
        } as BookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      })
    })
    afterEach(() => {
      cleanup()
    })

    it('should show pre-validation screen when pressing arrow back on confirmation screen', () => {
      mockUseOffer.mockReturnValueOnce({ data: { ...mockOffer, isDuo: false } })
      render(<BookingOfferModalComponent visible offerId={baseOffer.id} />)

      fireEvent.press(screen.getByTestId('Revenir à l’étape précédente'))

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'CHANGE_STEP',
        payload: Step.PRE_VALIDATION,
      })
    })
  })

  it('should not log booking funnel cancellation event when closing the modal', () => {
    render(<BookingOfferModalComponent visible offerId={20} />)
    const dismissModalButton = screen.getByTestId('Fermer la modale')

    fireEvent.press(dismissModalButton)

    expect(analytics.logCancelBookingFunnel).not.toHaveBeenCalled()
  })

  it('should display modal without prices by categories', () => {
    render(<BookingOfferModalComponent visible offerId={20} />)
    expect(screen.getByTestId('modalWithoutPricesByCategories')).toBeTruthy()
  })

  it('should not display modal with prices by categories', () => {
    render(<BookingOfferModalComponent visible offerId={20} />)
    expect(screen.queryByTestId('modalWithPricesByCategories')).toBeNull()
  })

  describe('when prices by categories feature flag activated', () => {
    beforeEach(() => {
      mockUseBookingContext.mockReturnValue({
        bookingState: {
          offerId: mockOffer.id,
          step: Step.DATE,
        } as BookingState,
        dismissModal: mockDismissModal,
        dispatch: mockDispatch,
      })
      useFeatureFlagSpy.mockReturnValue(true)
    })

    afterEach(() => {
      cleanup()
      useFeatureFlagSpy.mockReturnValue(false)
    })

    it('should log booking funnel cancellation event when closing the modal', () => {
      render(<BookingOfferModalComponent visible offerId={20} />)
      const dismissModalButton = screen.getByTestId('Fermer la modale')

      fireEvent.press(dismissModalButton)

      expect(analytics.logCancelBookingFunnel).toHaveBeenNthCalledWith(1, Step.DATE, 20)
    })

    it('should display modal with prices by categories', () => {
      mockUseOffer.mockReturnValueOnce({ data: { ...mockOffer, stocks: mockStocks } })
      render(<BookingOfferModalComponent visible offerId={20} />)
      expect(screen.getByTestId('modalWithPricesByCategories')).toBeTruthy()
    })

    it('should not display modal without prices by categories', () => {
      render(<BookingOfferModalComponent visible offerId={20} />)
      expect(screen.queryByTestId('modalWithoutPricesByCategories')).toBeNull()
    })
  })
})
