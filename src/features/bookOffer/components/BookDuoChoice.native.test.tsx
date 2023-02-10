import React from 'react'

import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { fireEvent, render, screen } from 'tests/utils'

import { BookDuoChoice } from './BookDuoChoice'

const mockStep = Step.DUO

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

jest.mock('react-query')

jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: jest.fn(() => ({
    dispatch: mockDispatch,
    bookingState: {
      quantity: 1,
      step: mockStep,
      date: new Date('2021-03-02T20:00:00'),
    } as BookingState,
    dismissModal: mockDismissModal,
  })),
}))

jest.mock('features/bookOffer/helpers/useBookingStock', () => ({
  useBookingStock: jest.fn(() => ({
    price: 2000,
    id: '148409',
    beginningDatetime: new Date('2021-03-02T20:00:00'),
  })),
}))

jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: jest.fn(() => mockOffer),
}))

let mockCreditOffer = 50000
jest.mock('features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit', () => ({
  useCreditForOffer: jest.fn(() => mockCreditOffer),
}))

describe('BookDuoChoice', () => {
  it('should display two blocs if offer is duo', () => {
    render(<BookDuoChoice />)

    const soloChoice = screen.queryByTestId('DuoChoice1-price')

    const duoChoice = screen.queryByTestId('DuoChoice2-price')

    expect(soloChoice).toBeTruthy()
    expect(duoChoice).toBeTruthy()

    expect(screen).toMatchSnapshot()
  })

  it('should select an item when pressed', () => {
    render(<BookDuoChoice />)

    const soloChoice = screen.getByTestId('DuoChoice1-price')

    fireEvent.press(soloChoice)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_QUANTITY', payload: 1 })
  })
  it("should show 'crédit insuffisant' if not enough credit", () => {
    mockCreditOffer = 0
    render(<BookDuoChoice />)

    expect(screen.getByTestId('DuoChoice1-price').props.children).toBe('crédit insuffisant')
  })
})
