import React from 'react'

import { BookingOfferModalFooter } from 'features/bookOffer/components/BookingOfferModalFooter'
import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { IBookingContext } from 'features/bookOffer/types'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('react-query')

const mockDispatch = jest.fn()
const mockUseBookingContext: jest.Mock<IBookingContext> = jest.fn(() => ({
  bookingState: { offerId: 1, step: Step.DATE } as BookingState,
  dismissModal: jest.fn(),
  dispatch: mockDispatch,
}))
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: () => mockUseBookingContext(),
}))

describe('BookingOfferModalFooter', () => {
  describe('when current step is date selection', () => {
    it('should display "Valider la date"', () => {
      render(<BookingOfferModalFooter />)
      expect(screen.getByText('Valider la date')).toBeTruthy()
    })

    it('should not change step when date not selected', () => {
      render(<BookingOfferModalFooter />)
      fireEvent.press(screen.getByText('Valider la date'))
      expect(mockDispatch).not.toHaveBeenCalled()
    })

    it('should change step to hour selection when date selected', () => {
      mockUseBookingContext.mockReturnValueOnce({
        bookingState: {
          offerId: 1,
          stockId: undefined,
          step: Step.DATE,
          quantity: undefined,
          date: new Date('01/02/2021'),
          hour: undefined,
        },
        dispatch: mockDispatch,
        dismissModal: jest.fn(),
      })
      render(<BookingOfferModalFooter />)
      fireEvent.press(screen.getByText('Valider la date'))
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'CHANGE_STEP', payload: Step.HOUR })
    })
  })

  describe('when current step is hour selection', () => {
    beforeEach(() => {
      mockUseBookingContext.mockReturnValue({
        bookingState: {
          offerId: 1,
          step: Step.HOUR,
          date: new Date('2023-04-01T18:00:00Z'),
        } as BookingState,
        dismissModal: jest.fn(),
        dispatch: jest.fn(),
      })
    })
    it('should display "Valider lʼhoraire"', () => {
      render(<BookingOfferModalFooter />)
      expect(screen.getByText('Valider lʼhoraire')).toBeTruthy()
    })

    it('should not change step when hour not selected', () => {
      render(<BookingOfferModalFooter />)
      fireEvent.press(screen.getByText('Valider lʼhoraire'))
      expect(mockDispatch).not.toHaveBeenCalled()
    })

    it('should change step to price selection when hour selected and has several prices', () => {
      mockUseBookingContext.mockReturnValueOnce({
        bookingState: {
          offerId: 1,
          stockId: undefined,
          step: Step.HOUR,
          quantity: undefined,
          date: new Date('01/02/2021'),
          hour: '2023-04-01T18:00:00Z',
        },
        dispatch: mockDispatch,
        dismissModal: jest.fn(),
      })
      render(<BookingOfferModalFooter hasPricesStep />)
      fireEvent.press(screen.getByText('Valider lʼhoraire'))
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'CHANGE_STEP', payload: Step.PRICE })
    })

    it('should change step to quantity selection when hour selected, has not several prices and offer is duo', () => {
      mockUseBookingContext.mockReturnValueOnce({
        bookingState: {
          offerId: 1,
          stockId: undefined,
          step: Step.HOUR,
          quantity: undefined,
          date: new Date('01/02/2021'),
          hour: '2023-04-01T18:00:00Z',
        },
        dispatch: mockDispatch,
        dismissModal: jest.fn(),
      })
      render(<BookingOfferModalFooter isDuo />)
      fireEvent.press(screen.getByText('Valider lʼhoraire'))
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'CHANGE_STEP', payload: Step.DUO })
    })

    it('should change step to confirmation when hour selected, has not several prices and offer is not duo', () => {
      mockUseBookingContext.mockReturnValueOnce({
        bookingState: {
          offerId: 1,
          stockId: undefined,
          step: Step.HOUR,
          quantity: undefined,
          date: new Date('01/02/2021'),
          hour: '2023-04-01T18:00:00Z',
        },
        dispatch: mockDispatch,
        dismissModal: jest.fn(),
      })
      render(<BookingOfferModalFooter />)
      fireEvent.press(screen.getByText('Valider lʼhoraire'))
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'VALIDATE_OPTIONS' })
    })
  })

  describe('when current step is price selection', () => {
    beforeEach(() => {
      mockUseBookingContext.mockReturnValue({
        bookingState: {
          offerId: 1,
          step: Step.PRICE,
          date: new Date('2023-04-01T18:00:00Z'),
          hour: '2023-04-01T18:00:00Z',
        } as BookingState,
        dismissModal: jest.fn(),
        dispatch: jest.fn(),
      })
    })
    it('should display "Valider le prix"', () => {
      render(<BookingOfferModalFooter hasPricesStep />)
      expect(screen.getByText('Valider le prix')).toBeTruthy()
    })

    it('should not change step when stock not selected', () => {
      render(<BookingOfferModalFooter />)
      fireEvent.press(screen.getByText('Valider le prix'))
      expect(mockDispatch).not.toHaveBeenCalled()
    })

    it('should change step to quantity selection when stock selected and offer is duo', () => {
      mockUseBookingContext.mockReturnValueOnce({
        bookingState: {
          stockId: 1,
          offerId: 1,
          step: Step.PRICE,
          quantity: undefined,
          date: new Date('01/02/2021'),
          hour: '2023-04-01T18:00:00Z',
        },
        dispatch: mockDispatch,
        dismissModal: jest.fn(),
      })
      render(<BookingOfferModalFooter isDuo />)
      fireEvent.press(screen.getByText('Valider le prix'))
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'CHANGE_STEP', payload: Step.DUO })
    })

    it('should change step to confirmation when stock selected and offer is not duo', () => {
      mockUseBookingContext.mockReturnValueOnce({
        bookingState: {
          stockId: 1,
          offerId: 1,
          step: Step.PRICE,
          quantity: undefined,
          date: new Date('01/02/2021'),
          hour: '2023-04-01T18:00:00Z',
        },
        dispatch: mockDispatch,
        dismissModal: jest.fn(),
      })
      render(<BookingOfferModalFooter />)
      fireEvent.press(screen.getByText('Valider le prix'))
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'VALIDATE_OPTIONS' })
    })
  })

  describe('when current step is quantity selection', () => {
    beforeEach(() => {
      mockUseBookingContext.mockReturnValue({
        bookingState: {
          stockId: 1,
          offerId: 1,
          step: Step.DUO,
          date: new Date('2023-04-01T18:00:00Z'),
          hour: '2023-04-01T18:00:00Z',
        } as BookingState,
        dismissModal: jest.fn(),
        dispatch: jest.fn(),
      })
    })
    it('should display "Finaliser ma réservation"', () => {
      render(<BookingOfferModalFooter isDuo />)
      expect(screen.getByText('Finaliser ma réservation')).toBeTruthy()
    })

    it('should not change step when quantity not selected', () => {
      render(<BookingOfferModalFooter isDuo />)
      fireEvent.press(screen.getByText('Finaliser ma réservation'))
      expect(mockDispatch).not.toHaveBeenCalled()
    })

    it('should change step to confirmation when quantity selected', () => {
      mockUseBookingContext.mockReturnValueOnce({
        bookingState: {
          stockId: 1,
          offerId: 1,
          step: Step.DUO,
          quantity: 1,
          date: new Date('01/02/2021'),
          hour: '2023-04-01T18:00:00Z',
        },
        dispatch: mockDispatch,
        dismissModal: jest.fn(),
      })
      render(<BookingOfferModalFooter isDuo />)
      fireEvent.press(screen.getByText('Finaliser ma réservation'))
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'VALIDATE_OPTIONS' })
    })
  })

  describe('when current step is confirmation', () => {
    beforeEach(() => {
      mockUseBookingContext.mockReturnValue({
        bookingState: {
          stockId: 1,
          offerId: 1,
          step: Step.CONFIRMATION,
          date: new Date('2023-04-01T18:00:00Z'),
          hour: '2023-04-01T18:00:00Z',
          quantity: 1,
        } as BookingState,
        dismissModal: jest.fn(),
        dispatch: jest.fn(),
      })
    })

    it('should not display footer', () => {
      render(<BookingOfferModalFooter hasPricesStep />)
      expect(screen.queryByTestId('bookingOfferModalFooter')).toBeNull()
    })
  })
})
