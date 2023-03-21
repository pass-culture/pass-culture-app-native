import React from 'react'

import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { mockOffer as mockBaseOffer } from 'features/bookOffer/fixtures/offer'
import { mockStocks, stock1, stock2, stock3, stock4 } from 'features/bookOffer/fixtures/stocks'
import { IBookingContext } from 'features/bookOffer/types'
import { fireEvent, render, screen } from 'tests/utils'

import { BookHourChoice } from './BookHourChoice'

const mockStep = Step.HOUR
const mockDuoStep = Step.DUO

const mockDispatch = jest.fn()

const mockUseBookingContext: jest.Mock<IBookingContext> = jest.fn()
mockUseBookingContext.mockReturnValue({
  bookingState: {
    quantity: 1,
    step: mockStep,
    date: new Date('2021-03-02T20:00:00'),
  } as BookingState,
  dismissModal: jest.fn(),
  dispatch: mockDispatch,
})
jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: () => mockUseBookingContext(),
}))

jest.mock('features/bookOffer/helpers/useBookingStock', () => ({
  useBookingStock: jest.fn(() => ({
    price: 2000,
    id: '148409',
    beginningDatetime: new Date('2021-03-02T20:00:00'),
  })),
}))

let mockOffer = mockBaseOffer
jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: jest.fn(() => mockOffer),
}))

let mockCreditOffer = 50000
jest.mock('features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit', () => ({
  useCreditForOffer: jest.fn(() => mockCreditOffer),
}))

jest.mock('react-query')

describe('BookHourChoice when hour is already selected', () => {
  beforeEach(() => {
    mockUseBookingContext.mockReturnValueOnce({
      bookingState: {
        quantity: undefined,
        step: mockDuoStep,
        date: new Date('2021-03-02T20:00:00'),
      } as BookingState,
      dismissModal: jest.fn(),
      dispatch: mockDispatch,
    })
  })

  it('should change step to Hour', () => {
    render(<BookHourChoice />)

    expect(screen).toMatchSnapshot()

    const selectedHour = screen.getByText('20:00')

    fireEvent.press(selectedHour)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CHANGE_STEP', payload: Step.HOUR })
  })
})

describe('BookHourChoice', () => {
  beforeEach(() => {
    mockUseBookingContext.mockReturnValueOnce({
      bookingState: {
        quantity: 1,
        step: mockStep,
        date: new Date('2021-03-02T20:00:00'),
      } as BookingState,
      dismissModal: jest.fn(),
      dispatch: mockDispatch,
    })
  })

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

describe('BookHourChoice when prices by category feature flag activated and there are several stocks', () => {
  beforeEach(() => {
    mockUseBookingContext.mockReturnValueOnce({
      bookingState: {
        quantity: undefined,
        step: mockStep,
        date: new Date('2023-04-01T18:00:00'),
      } as BookingState,
      dismissModal: jest.fn(),
      dispatch: mockDispatch,
    })
    mockOffer = { ...mockOffer, stocks: [stock1, stock2, { ...stock3, isBookable: false }, stock4] }
    mockCreditOffer = 50000
  })

  it('should render only one hour choice with "dès" and the minimum price available when has several prices for an hour', () => {
    render(<BookHourChoice enablePricesByCategories />)
    expect(screen.getByText(`dès 190\u00a0€`)).toBeTruthy()
  })

  it('should render only one hour choice without "dès" and the minimum price when has only one price for an hour', () => {
    render(<BookHourChoice enablePricesByCategories />)
    expect(screen.getByText(`210\u00a0€`)).toBeTruthy()
  })

  it('should display hour items with stock selection', () => {
    render(<BookHourChoice enablePricesByCategories />)
    expect(screen.getByTestId('HourChoice2023-04-01T18:00:00Z-hour')).toBeTruthy()
    expect(screen.getByTestId('HourChoice2023-04-01T20:00:00Z-hour')).toBeTruthy()
  })

  it('should not display hour item with stock selection', () => {
    render(<BookHourChoice enablePricesByCategories />)
    expect(screen.queryByTestId('HourChoice18755-hour')).toBeNull()
    expect(screen.queryByTestId('HourChoice18756-hour')).toBeNull()
    expect(screen.queryByTestId('HourChoice18757-hour')).toBeNull()
    expect(screen.queryByTestId('HourChoice18758-hour')).toBeNull()
  })
})

describe('BookHourChoice when prices by category feature flag activated and there is only one stock', () => {
  beforeEach(() => {
    mockUseBookingContext.mockReturnValueOnce({
      bookingState: {
        quantity: undefined,
        step: mockStep,
        date: new Date('2023-04-01T18:00:00'),
      } as BookingState,
      dismissModal: jest.fn(),
      dispatch: mockDispatch,
    })
    mockOffer = { ...mockOffer, stocks: [stock1] }
    mockCreditOffer = 50000
  })

  it('should render only one hour choice with the minimum price', () => {
    render(<BookHourChoice enablePricesByCategories />)
    expect(screen.queryByText(`dès 210\u00a0€`)).toBeNull()
    expect(screen.getByText(`210\u00a0€`)).toBeTruthy()
  })

  it('should display hour item with stock selection', () => {
    render(<BookHourChoice enablePricesByCategories />)
    expect(screen.getByTestId('HourChoice18758-hour')).toBeTruthy()
  })

  it('should not display hour item without stock selection', () => {
    render(<BookHourChoice enablePricesByCategories />)
    expect(screen.queryByTestId('HourChoice2023-04-01T20:00:00Z-hour')).toBeNull()
  })

  it('should select the stock when pressing an hour item', () => {
    render(<BookHourChoice enablePricesByCategories />)
    fireEvent.press(screen.getByTestId('HourChoice18758-hour'))
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: stock1.id })
  })
})

describe('BookHourChoice when prices by category feature flag desactivated and there are several stocks', () => {
  beforeEach(() => {
    mockUseBookingContext.mockReturnValueOnce({
      bookingState: {
        quantity: undefined,
        step: mockStep,
        date: new Date('2023-04-01T18:00:00'),
      } as BookingState,
      dismissModal: jest.fn(),
      dispatch: mockDispatch,
    })
    mockOffer = { ...mockOffer, stocks: mockStocks }
    mockCreditOffer = 50000
  })

  it('should render all hours choices with its prices', () => {
    render(<BookHourChoice />)
    expect(screen.getByText(`210\u00a0€`)).toBeTruthy()
    expect(screen.getByText(`220\u00a0€`)).toBeTruthy()
    expect(screen.getByText(`190\u00a0€`)).toBeTruthy()
    expect(screen.getByText(`100\u00a0€`)).toBeTruthy()
  })

  it('should display all hour items with stock selection', () => {
    render(<BookHourChoice />)
    expect(screen.getByTestId('HourChoice18755-hour')).toBeTruthy()
    expect(screen.getByTestId('HourChoice18756-hour')).toBeTruthy()
    expect(screen.getByTestId('HourChoice18757-hour')).toBeTruthy()
    expect(screen.getByTestId('HourChoice18758-hour')).toBeTruthy()
  })

  it('should not display hour item without stock selection', () => {
    render(<BookHourChoice />)
    expect(screen.queryByTestId('HourChoice2023-04-01T18:00:00Z-hour')).toBeNull()
    expect(screen.queryByTestId('HourChoice2023-04-01T20:00:00Z-hour')).toBeNull()
  })
})

describe('BookHourChoice when prices by category feature flag desactivated and there is only one stock', () => {
  beforeEach(() => {
    mockUseBookingContext.mockReturnValueOnce({
      bookingState: {
        quantity: undefined,
        step: mockStep,
        date: new Date('2023-04-01T18:00:00'),
      } as BookingState,
      dismissModal: jest.fn(),
      dispatch: mockDispatch,
    })
    mockOffer = { ...mockOffer, stocks: [stock1] }
    mockCreditOffer = 50000
  })

  it('should render only one hour choice with its price', () => {
    render(<BookHourChoice />)
    expect(screen.getByText(`210\u00a0€`)).toBeTruthy()
  })

  it('should display all hour items with stock selection', () => {
    render(<BookHourChoice />)

    expect(screen.getByTestId('HourChoice18758-hour')).toBeTruthy()
  })

  it('should not display hour item without stock selection', () => {
    render(<BookHourChoice />)
    expect(screen.queryByTestId('HourChoice2023-04-01T20:00:00Z-hour')).toBeNull()
  })
})
