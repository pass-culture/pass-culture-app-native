import React from 'react'

import { OfferResponseV2 } from 'api/gen'
import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { mockOffer as mockBaseOffer } from 'features/bookOffer/fixtures/offer'
import { stock1, stock2, stock3, stock4 } from 'features/bookOffer/fixtures/stocks'
import { IBookingContext } from 'features/bookOffer/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen, userEvent } from 'tests/utils'

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

let mockOffer: OfferResponseV2 = mockBaseOffer
jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: jest.fn(() => mockOffer),
}))

let mockCreditOffer = 50000
jest.mock('features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit', () => ({
  useCreditForOffer: jest.fn(() => mockCreditOffer),
}))

const user = userEvent.setup()
jest.useFakeTimers()

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
    setFeatureFlags()
  })

  it('should change step to Hour', async () => {
    render(<BookHourChoice />)

    const selectedHour = screen.getByText('20:00')

    await user.press(selectedHour)

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
    const firstStock = screen.queryAllByTestId('HourChoice148409-label')
    // secondStock corresponds to 2021-03-17 stock
    const secondStock = screen.queryAllByTestId('HourChoice148410-label')
    // thirdStock corresponds to 2021-03-02 stock 10h
    const thirdStock = screen.queryAllByTestId('HourChoice148411-label')

    expect(firstStock).toHaveLength(1)
    expect(secondStock).toHaveLength(0)
    expect(thirdStock).toHaveLength(1)
  })

  it('should select an item when pressed', async () => {
    render(<BookHourChoice />)

    // firstStock correspond to 2021-03-02 stock
    const firstStock = screen.getByTestId('HourChoice148409-label')
    await user.press(firstStock)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 148409 })
  })

  it('should pass formatted hour and price props', () => {
    render(<BookHourChoice />)

    const firstHour = screen.getByTestId('HourChoice148409-label')
    const firstPrice = screen.getByTestId('HourChoice148409-right-text')

    expect(firstHour.props.children).toBe('21h00')
    expect(firstPrice.props.children).toBe('24\u00a0€')

    const secondHour = screen.getByTestId('HourChoice148411-label')
    const secondPrice = screen.getByTestId('HourChoice148411-right-text')

    expect(secondHour.props.children).toBe('11h00')
    expect(secondPrice.props.children).toBe('épuisé')
  })

  it("should show 'crédit insuffisant' if not enough credit", () => {
    mockCreditOffer = 0
    render(<BookHourChoice />)

    expect(screen.getByTestId('HourChoice148409-right-text').props.children).toBe(
      'crédit insuffisant'
    )
  })
})

describe('BookHourChoice when there are several stocks', () => {
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
    render(<BookHourChoice />)

    expect(screen.getByText(`dès 190\u00a0€`)).toBeOnTheScreen()
  })

  it('should render only one hour choice without "dès" and the minimum price when has only one price for an hour', () => {
    render(<BookHourChoice />)

    expect(screen.getByText(`210\u00a0€`)).toBeOnTheScreen()
  })

  it('should display hour items with stock selection', () => {
    render(<BookHourChoice />)

    expect(screen.getByTestId('HourChoice2023-04-01T18:00:00Z-label')).toBeOnTheScreen()
    expect(screen.getByTestId('HourChoice2023-04-01T20:00:00Z-label')).toBeOnTheScreen()
  })

  it('should not display hour item with stock selection', () => {
    render(<BookHourChoice />)

    expect(screen.queryByTestId('HourChoice18755-label')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('HourChoice18756-label')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('HourChoice18757-label')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('HourChoice18758-label')).not.toBeOnTheScreen()
  })

  it('should display "épuisé" when there are not stock bookable on hour item', () => {
    mockOffer = {
      ...mockOffer,
      stocks: [
        { ...stock2, isBookable: false, remainingQuantity: 0, isSoldOut: true },
        { ...stock3, isBookable: false, remainingQuantity: 0, isSoldOut: true },
        { ...stock4, isBookable: false, remainingQuantity: 0, isSoldOut: true },
      ],
    }
    render(<BookHourChoice />)

    expect(screen.getByText('épuisé')).toBeOnTheScreen()
  })

  it('should set the hour selected when pressing hour item', async () => {
    render(<BookHourChoice />)

    await user.press(screen.getByText('20h00'))

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SELECT_HOUR',
      payload: '2023-04-01T20:00:00Z',
    })
  })

  it('should set the stock selected when pressing hour item and there is only one stock', async () => {
    mockOffer = {
      ...mockOffer,
      stocks: [stock1],
    }

    render(<BookHourChoice />)

    await user.press(screen.getByText('22h00'))

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SELECT_STOCK',
      payload: 18758,
    })
  })

  it('should not set the stock selected when pressing hour item and there are several stock', async () => {
    mockOffer = {
      ...mockOffer,
      stocks: [stock1, { ...stock1, price: 22000, priceCategoryLabel: 'Pelouse or' }],
    }
    render(<BookHourChoice />)

    await user.press(screen.getByText('20h00'))

    expect(mockDispatch).not.toHaveBeenCalledWith({
      type: 'SELECT_STOCK',
      payload: 18758,
    })
  })

  it('should set the quantity at 1 when pressing hour item and offer is not duo', async () => {
    mockOffer = {
      ...mockOffer,
      isDuo: false,
    }
    render(<BookHourChoice />)

    await user.press(screen.getByText('20h00'))

    expect(mockDispatch).not.toHaveBeenCalledWith(1, {
      type: 'SELECT_QUANTITY',
      payload: 1,
    })
  })

  it('should not set the quantity at 1 when pressing hour item and offer is duo', async () => {
    render(<BookHourChoice />)

    await user.press(screen.getByText('20h00'))

    expect(mockDispatch).not.toHaveBeenCalledWith(1, {
      type: 'SELECT_QUANTITY',
      payload: 1,
    })
  })
})

describe('BookHourChoice when there is only one stock', () => {
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
    render(<BookHourChoice />)

    expect(screen.queryByText(`dès 210\u00a0€`)).not.toBeOnTheScreen()
    expect(screen.getByText(`210\u00a0€`)).toBeOnTheScreen()
  })

  it('should display hour item with stock selection', () => {
    render(<BookHourChoice />)

    expect(screen.getByTestId('HourChoice18758-label')).toBeOnTheScreen()
  })

  it('should not display hour item without stock selection', () => {
    render(<BookHourChoice />)

    expect(screen.queryByTestId('HourChoice2023-04-01T20:00:00Z-label')).not.toBeOnTheScreen()
  })

  it('should select the stock when pressing an hour item', async () => {
    render(<BookHourChoice />)
    await user.press(screen.getByTestId('HourChoice18758-label'))

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: stock1.id })
  })

  it('should display "épuisé" when there are not stock bookable on hour item', () => {
    mockOffer = {
      ...mockOffer,
      stocks: [{ ...stock1, isBookable: false, remainingQuantity: 0, isSoldOut: true }],
    }
    render(<BookHourChoice />)

    expect(screen.getByText('épuisé')).toBeOnTheScreen()
  })
})
