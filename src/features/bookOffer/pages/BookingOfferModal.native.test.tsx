import React from 'react'

import { OfferResponse, SubcategoryIdEnum } from 'api/gen'
import * as Auth from 'features/auth/context/AuthContext'
import { Step } from 'features/bookOffer/context/reducer'
import { mockOffer as baseOffer } from 'features/bookOffer/fixtures/offer'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/firebase/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { placeholderData as mockSubcategoriesData } from 'libs/subcategories/placeholderData'
import { cleanup, fireEvent, render, screen } from 'tests/utils'

import { BookingOfferModalComponent } from './BookingOfferModal'

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

let mockStep = Step.DATE
const mockOffer: OfferResponse | undefined = baseOffer

jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: jest.fn(() => ({
    dispatch: mockDispatch,
    bookingState: { quantity: 1, step: mockStep },
    dismissModal: mockDismissModal,
  })),
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

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

describe('<BookingOfferModalComponent />', () => {
  beforeEach(() => {
    mockStep = Step.DATE
  })
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
    it('should show pre-validation screen when pressing arrow back on confirmation screen', () => {
      mockStep = Step.CONFIRMATION
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
      mockOffer.isDuo = false
    })
    afterEach(() => {
      cleanup()
    })

    it('should show pre-validation screen when pressing arrow back on confirmation screen', () => {
      mockStep = Step.CONFIRMATION
      render(<BookingOfferModalComponent visible offerId={baseOffer.id} />)

      fireEvent.press(screen.getByTestId('Revenir à l’étape précédente'))

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'CHANGE_STEP',
        payload: Step.PRE_VALIDATION,
      })
    })
  })

  describe('when prices by category feature flag activated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValue(true)
      mockOffer.subcategoryId = SubcategoryIdEnum.CINE_PLEIN_AIR
    })
    afterEach(() => {
      cleanup()
    })

    describe('when offer is duo', () => {
      beforeEach(() => {
        mockOffer.isDuo = true
      })
      afterEach(() => {
        cleanup()
      })

      it.each`
        idStep               | step                        | idPreviousStep | previousStep
        ${Step.HOUR}         | ${'hour selection'}         | ${Step.DATE}   | ${'date selection'}
        ${Step.DUO}          | ${'number place selection'} | ${Step.HOUR}   | ${'hour selection'}
        ${Step.CONFIRMATION} | ${'confirmation screen'}    | ${Step.DUO}    | ${'number place selection'}
      `(
        'should show $previousStep when pressing arrow back on $step',
        ({ idStep, idPreviousStep }) => {
          mockStep = idStep
          render(<BookingOfferModalComponent visible offerId={baseOffer.id} />)

          fireEvent.press(screen.getByTestId('Revenir à l’étape précédente'))

          expect(mockDispatch).toHaveBeenCalledWith({
            type: 'CHANGE_STEP',
            payload: idPreviousStep,
          })
        }
      )
    })

    describe('when offer is not duo', () => {
      beforeEach(() => {
        mockOffer.isDuo = false
      })
      afterEach(() => {
        cleanup()
      })

      it.each`
        idStep               | step                     | idPreviousStep | previousStep
        ${Step.HOUR}         | ${'hour selection'}      | ${Step.DATE}   | ${'date selection'}
        ${Step.CONFIRMATION} | ${'confirmation screen'} | ${Step.HOUR}   | ${'hour selection'}
      `(
        'should show $previousStep when pressing arrow back on $step',
        ({ idStep, idPreviousStep }) => {
          mockOffer.subcategoryId = SubcategoryIdEnum.CINE_PLEIN_AIR
          mockStep = idStep
          render(<BookingOfferModalComponent visible offerId={baseOffer.id} />)

          fireEvent.press(screen.getByTestId('Revenir à l’étape précédente'))

          expect(mockDispatch).toHaveBeenCalledWith({
            type: 'CHANGE_STEP',
            payload: idPreviousStep,
          })
        }
      )
    })
  })
})
