import React from 'react'

import { BookPricesChoice } from 'features/bookOffer/components/BookPricesChoice'
import { BookingState, initialBookingState } from 'features/bookOffer/context/reducer'
import { mockStocks } from 'features/bookOffer/fixtures/stocks'
import { IBookingContext } from 'features/bookOffer/types'
import { fireEvent, render, screen } from 'tests/utils'

const mockInitialBookingState = initialBookingState

const mockOfferId = 1337
const mockUseBookingContext: jest.Mock<IBookingContext> = jest.fn()
const mockDispatch = jest.fn()
mockUseBookingContext.mockReturnValue({
  bookingState: { quantity: 1, offerId: mockOfferId } as BookingState,
  dismissModal: jest.fn(),
  dispatch: mockDispatch,
})
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: () => mockUseBookingContext(),
}))

const mockCreditOffer = 50000
jest.mock('features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit', () => ({
  useCreditForOffer: jest.fn(() => mockCreditOffer),
}))

describe('BookPricesChoice', () => {
  beforeEach(() => {
    mockUseBookingContext.mockReturnValueOnce({
      bookingState: {
        ...mockInitialBookingState,
        offerId: mockOfferId,
        date: new Date('2023-04-01T18:00:00Z'),
        hour: '2023-04-01T18:00:00Z',
      },
      dismissModal: jest.fn(),
      dispatch: mockDispatch,
    })
  })

  it('should render prices of stocks in parameter', () => {
    render(<BookPricesChoice stocks={mockStocks} />)

    expect(screen.getByText('Tribune présidentielle')).toBeTruthy()
    expect(screen.getByText('Pelouse or')).toBeTruthy()
  })

  it('should select price stock when pressing a price and offer is duo', () => {
    render(<BookPricesChoice stocks={mockStocks} isDuo />)

    fireEvent.press(screen.getByText('Tribune présidentielle'))

    expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: 'SELECT_STOCK', payload: 18758 })
    expect(mockDispatch).toHaveBeenCalledTimes(1)
  })

  it('should select a quantity of 1 in addition to the price stock when pressing a price and offer is not duo', () => {
    render(<BookPricesChoice stocks={mockStocks} />)

    fireEvent.press(screen.getByText('Tribune présidentielle'))

    expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: 'SELECT_STOCK', payload: 18758 })
    expect(mockDispatch).toHaveBeenNthCalledWith(2, { type: 'SELECT_QUANTITY', payload: 1 })
  })
})
