import React from 'react'

import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { useBooking } from 'features/bookOffer/pages/BookingOfferWrapper'
import { BookingState, Step } from 'features/bookOffer/pages/reducer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render } from 'tests/utils'

import { BookHourChoice } from './BookHourChoice'

const mockStep = Step.HOUR
const mockDuoStep = Step.DUO

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

const mockUseBooking = useBooking as jest.Mock
jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBooking: jest.fn(() => ({
    dispatch: mockDispatch,
    bookingState: {
      quantity: 1,
      step: mockStep,
      date: new Date('2021-03-02T20:00:00'),
    } as BookingState,
    dismissModal: mockDismissModal,
  })),
  useBookingStock: jest.fn(() => ({
    price: 2000,
    id: '148409',
    beginningDatetime: new Date('2021-03-02T20:00:00'),
  })),
  useBookingOffer: jest.fn(() => mockOffer),
}))

let mockCreditOffer = 50000
jest.mock('features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit', () => ({
  useCreditForOffer: jest.fn(() => mockCreditOffer),
}))

describe('BookHourChoice when hour is already selected', () => {
  it('should change step to Hour', async () => {
    mockUseBooking.mockImplementationOnce(() => ({
      dispatch: mockDispatch,
      bookingState: {
        quantity: undefined,
        step: mockDuoStep,
        date: new Date('2021-03-02T20:00:00'),
      } as BookingState,
      dismissModal: mockDismissModal,
    }))
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const page = render(reactQueryProviderHOC(<BookHourChoice />))

    expect(page).toMatchSnapshot()

    const selectedHour = page.getByText('20:00')

    act(() => fireEvent.press(selectedHour))

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CHANGE_STEP', payload: Step.HOUR })
  })
})

describe('BookHourChoice', () => {
  it('should display filtered stocks for selected Date', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const page = render(reactQueryProviderHOC(<BookHourChoice />))

    // firstStock corresponds to 2021-03-02 stock 20h
    const firstStock = page.queryAllByTestId('HourChoice148409-hour')
    // secondStock corresponds to 2021-03-17 stock
    const secondStock = page.queryAllByTestId('HourChoice148410-hour')
    // thirdStock corresponds to 2021-03-02 stock 10h
    const thirdStock = page.queryAllByTestId('HourChoice148411-hour')

    expect(firstStock.length).toBe(1)
    expect(secondStock.length).toBe(0)
    expect(thirdStock.length).toBe(1)

    expect(page).toMatchSnapshot()
  })

  it('should select an item when pressed', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const page = render(reactQueryProviderHOC(<BookHourChoice />))

    // firstStock correspond to 2021-03-02 stock
    const firstStock = page.queryByTestId('HourChoice148409-hour')

    if (firstStock) {
      act(() => fireEvent.press(firstStock))

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 148409 })
    } else {
      throw new Error('should have find firstStock')
    }
  })

  it('should pass formatted hour and price props', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const page = render(reactQueryProviderHOC(<BookHourChoice />))

    const firstHour = page.getByTestId('HourChoice148409-hour')
    const firstPrice = page.getByTestId('HourChoice148409-price')

    expect(firstHour.props.children).toBe('20h00')
    expect(firstPrice.props.children).toBe('24\u00a0€')

    const secondHour = page.getByTestId('HourChoice148411-hour')
    const secondPrice = page.getByTestId('HourChoice148411-price')

    expect(secondHour.props.children).toBe('10h00')
    expect(secondPrice.props.children).toBe('épuisé')
  })

  it("should show 'crédit insuffisant' if not enough credit", () => {
    mockCreditOffer = 0
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const page = render(reactQueryProviderHOC(<BookHourChoice />))
    expect(page.getByTestId('HourChoice148409-price').props.children).toBe('crédit insuffisant')
  })
})
