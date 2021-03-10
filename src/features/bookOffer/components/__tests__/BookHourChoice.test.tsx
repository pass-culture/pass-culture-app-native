import { act, fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { Step } from 'features/bookOffer/pages/reducer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { BookHourChoice } from '../BookHourChoice'
const mockStep = Step.HOUR

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBooking: jest.fn(() => ({
    dispatch: mockDispatch,
    bookingState: { quantity: 1, step: mockStep, date: new Date('2021-03-02T20:00:00') },
    dismissModal: mockDismissModal,
  })),
  useBookingOffer: jest.fn(() => mockOffer),
}))

describe('BookHourChoice', () => {
  it('should display filtered stocks for selected Date', () => {
    const page = render(reactQueryProviderHOC(<BookHourChoice />))

    // firstStock correspond to 2021-03-02 stock
    const firstStock = page.queryAllByTestId('HourChoice148409')
    // secondStock correspond to 2021-03-17 stock
    const secondStock = page.queryAllByTestId('HourChoice148410')

    expect(firstStock.length).toBe(1)
    expect(secondStock.length).toBe(0)
  })

  it('should select an item when pressed', async () => {
    const page = render(reactQueryProviderHOC(<BookHourChoice />))

    // firstStock correspond to 2021-03-02 stock
    const firstStock = page.queryByTestId('HourChoice148409')

    if (firstStock) {
      act(() => fireEvent.press(firstStock))

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 148409 })
    } else {
      throw new Error('should have find firstStock')
    }
  })

  it('should pass formatted hour and price props', () => {
    const page = render(reactQueryProviderHOC(<BookHourChoice />))

    const hour = page.getByTestId('hour')
    const price = page.getByTestId('price')

    expect(hour.props.children).toBe('20h00')
    expect(price.props.children).toBe('24€')
  })
})
