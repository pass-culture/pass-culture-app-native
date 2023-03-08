import React from 'react'

import { BookingOfferModalHeader } from 'features/bookOffer/components/BookingOfferModalHeader'
import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { mockStocks, stock1 } from 'features/bookOffer/fixtures/stocks'
import { IBookingContext } from 'features/bookOffer/types'
import { render, screen } from 'tests/utils'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'

jest.mock('react-query')

const mockUseBookingContext: jest.Mock<IBookingContext> = jest.fn(() => ({
  bookingState: { offerId: 1, step: Step.DATE } as BookingState,
  dismissModal: jest.fn(),
  dispatch: jest.fn(),
}))
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: () => mockUseBookingContext(),
}))

const undefinedModalLeftIconProps: ModalLeftIconProps = {
  leftIconAccessibilityLabel: undefined,
  leftIcon: undefined,
  onLeftIconPress: undefined,
}

const definedModalLeftIconProps: ModalLeftIconProps = {
  leftIconAccessibilityLabel: 'Revenir à l’étape précédente',
  leftIcon: ArrowPrevious,
  onLeftIconPress: jest.fn(),
}

describe('BookingOfferModalHeader', () => {
  describe('when current step is date selection', () => {
    it('should display "Étape 1 sur 4" when offer is duo and has several stocks', () => {
      render(
        <BookingOfferModalHeader
          modalLeftIconProps={undefinedModalLeftIconProps}
          onClose={jest.fn()}
          stocks={mockStocks}
          isDuo
        />
      )
      expect(screen.getByText('Étape 1 sur 4')).toBeTruthy()
    })

    describe('should display "Étape 1 sur 3', () => {
      it('when offer is duo and has not several stocks', () => {
        render(
          <BookingOfferModalHeader
            modalLeftIconProps={undefinedModalLeftIconProps}
            onClose={jest.fn()}
            stocks={[stock1]}
            isDuo
          />
        )
        expect(screen.getByText('Étape 1 sur 3')).toBeTruthy()
      })

      it('when offer is not duo and has several stocks', () => {
        render(
          <BookingOfferModalHeader
            modalLeftIconProps={undefinedModalLeftIconProps}
            onClose={jest.fn()}
            stocks={mockStocks}
          />
        )
        expect(screen.getByText('Étape 1 sur 3')).toBeTruthy()
      })
    })

    it('should display "Étape 1 sur 2" when offer is not duo and has not several stocks', () => {
      render(
        <BookingOfferModalHeader
          modalLeftIconProps={undefinedModalLeftIconProps}
          onClose={jest.fn()}
          stocks={[stock1]}
        />
      )
      expect(screen.getByText('Étape 1 sur 2')).toBeTruthy()
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
    it('should display "Étape 2 sur 4" when offer is duo and has several stocks', () => {
      render(
        <BookingOfferModalHeader
          modalLeftIconProps={definedModalLeftIconProps}
          onClose={jest.fn()}
          stocks={mockStocks}
          isDuo
        />
      )
      expect(screen.getByText('Étape 2 sur 4')).toBeTruthy()
    })

    describe('should display "Étape 2 sur 3', () => {
      it('when offer is duo and has not several stocks', () => {
        render(
          <BookingOfferModalHeader
            modalLeftIconProps={definedModalLeftIconProps}
            onClose={jest.fn()}
            stocks={[stock1]}
            isDuo
          />
        )
        expect(screen.getByText('Étape 2 sur 3')).toBeTruthy()
      })

      it('when offer is not duo and has several stocks', () => {
        render(
          <BookingOfferModalHeader
            modalLeftIconProps={definedModalLeftIconProps}
            onClose={jest.fn()}
            stocks={mockStocks}
          />
        )
        expect(screen.getByText('Étape 2 sur 3')).toBeTruthy()
      })
    })

    it('should display "Étape 2 sur 2" when offer is not duo and has not several stocks', () => {
      render(
        <BookingOfferModalHeader
          modalLeftIconProps={definedModalLeftIconProps}
          onClose={jest.fn()}
          stocks={[stock1]}
        />
      )
      expect(screen.getByText('Étape 2 sur 2')).toBeTruthy()
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
    it('should display "Étape 3 sur 4" when offer is duo and has several stocks', () => {
      render(
        <BookingOfferModalHeader
          modalLeftIconProps={definedModalLeftIconProps}
          onClose={jest.fn()}
          stocks={mockStocks}
          isDuo
        />
      )
      expect(screen.getByText('Étape 3 sur 4')).toBeTruthy()
    })

    it('should display "Étape 3 sur 3" when offer is not duo and has several stocks', () => {
      render(
        <BookingOfferModalHeader
          modalLeftIconProps={definedModalLeftIconProps}
          onClose={jest.fn()}
          stocks={mockStocks}
        />
      )
      expect(screen.getByText('Étape 3 sur 3')).toBeTruthy()
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

    it('should display "Étape 4 sur 4" when has several stocks', () => {
      render(
        <BookingOfferModalHeader
          modalLeftIconProps={definedModalLeftIconProps}
          onClose={jest.fn()}
          stocks={mockStocks}
          isDuo
        />
      )
      expect(screen.getByText('Étape 4 sur 4')).toBeTruthy()
    })

    it('should display "Étape 3 sur 3" when has not several stocks', () => {
      render(
        <BookingOfferModalHeader
          modalLeftIconProps={definedModalLeftIconProps}
          onClose={jest.fn()}
          stocks={[stock1]}
          isDuo
        />
      )
      expect(screen.getByText('Étape 3 sur 3')).toBeTruthy()
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

    it('should not display step', () => {
      render(
        <BookingOfferModalHeader
          modalLeftIconProps={definedModalLeftIconProps}
          onClose={jest.fn()}
          stocks={[stock1]}
          isDuo
        />
      )
      expect(screen.queryByText('Étape')).toBeNull()
    })
  })
})
