import React from 'react'

import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { fireEvent, render, screen } from 'tests/utils'

import { BookHourChoice } from './BookHourChoice'

const mockStep = Step.HOUR
const mockDuoStep = Step.DUO

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

const mockUseBooking = useBookingContext as jest.Mock
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

jest.mock('react-query')

describe('BookHourChoice when hour is already selected', () => {
  it('should change step to Hour', () => {
    mockUseBooking.mockImplementationOnce(() => ({
      dispatch: mockDispatch,
      bookingState: {
        quantity: undefined,
        step: mockDuoStep,
        date: new Date('2021-03-02T20:00:00'),
      } as BookingState,
      dismissModal: mockDismissModal,
    }))

    render(<BookHourChoice />)

    expect(screen).toMatchSnapshot()

    const selectedHour = screen.getByText('20:00')

    fireEvent.press(selectedHour)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CHANGE_STEP', payload: Step.HOUR })
  })
})

describe('BookHourChoice', () => {
  it('should display filtered stocks for selected Date', () => {
    render(<BookHourChoice />)

    // firstStock corresponds to 2021-03-02 stock 20h
    const firstStock = screen.queryAllByTestId('HourChoice148409-hour')
    // secondStock corresponds to 2021-03-17 stock
    const secondStock = screen.queryAllByTestId('HourChoice148410-hour')
    // thirdStock corresponds to 2021-03-02 stock 10h
    const thirdStock = screen.queryAllByTestId('HourChoice148411-hour')

    expect(firstStock.length).toBe(1)
    expect(secondStock.length).toBe(0)
    expect(thirdStock.length).toBe(1)

    expect(screen).toMatchSnapshot()
  })

  it('should select an item when pressed', () => {
    render(<BookHourChoice />)

    // firstStock correspond to 2021-03-02 stock
    const firstStock = screen.queryByTestId('HourChoice148409-hour')

    if (firstStock) {
      fireEvent.press(firstStock)

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 148409 })
    } else {
      throw new Error('should have find firstStock')
    }
  })

  it('should pass formatted hour and price props', () => {
    render(<BookHourChoice />)

    const firstHour = screen.getByTestId('HourChoice148409-hour')
    const firstPrice = screen.getByTestId('HourChoice148409-price')

    expect(firstHour.props.children).toBe('20h00')
    expect(firstPrice.props.children).toBe('24\u00a0€')

    const secondHour = screen.getByTestId('HourChoice148411-hour')
    const secondPrice = screen.getByTestId('HourChoice148411-price')

    expect(secondHour.props.children).toBe('10h00')
    expect(secondPrice.props.children).toBe('épuisé')
  })

  it("should show 'crédit insuffisant' if not enough credit", () => {
    mockCreditOffer = 0
    render(<BookHourChoice />)
    expect(screen.getByTestId('HourChoice148409-price').props.children).toBe('crédit insuffisant')
  })
})
