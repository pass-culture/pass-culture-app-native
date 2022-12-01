import React from 'react'

import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { BookingState, Step } from 'features/bookOffer/pages/reducer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render } from 'tests/utils'

import { BookDuoChoice } from './BookDuoChoice'

const mockStep = Step.DUO

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

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

describe('BookDuoChoice', () => {
  it('should display two blocs if offer is duo', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const page = render(reactQueryProviderHOC(<BookDuoChoice />))

    const soloChoice = page.queryByTestId('DuoChoice1')

    const duoChoice = page.queryByTestId('DuoChoice2')

    expect(soloChoice).toBeTruthy()
    expect(duoChoice).toBeTruthy()

    expect(page).toMatchSnapshot()
  })

  it('should select an item when pressed', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const page = render(reactQueryProviderHOC(<BookDuoChoice />))

    const soloChoice = page.getByTestId('DuoChoice1')

    act(() => fireEvent.press(soloChoice))

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_QUANTITY', payload: 1 })
  })
  it("should show 'crédit insuffisant' if not enough credit", () => {
    mockCreditOffer = 0
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const page = render(reactQueryProviderHOC(<BookDuoChoice />))

    expect(page.getByTestId('DuoChoice1-price').props.children).toBe('crédit insuffisant')
  })
})
