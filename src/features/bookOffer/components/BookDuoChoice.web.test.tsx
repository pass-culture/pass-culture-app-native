import React from 'react'

import { BookingState, Step } from 'features/bookOffer/context/reducer'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils/web'

import { BookDuoChoice } from './BookDuoChoice'

const mockStep = Step.DUO

const mockDismissModal = jest.fn()
const mockDispatch = jest.fn()

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
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const page = render(reactQueryProviderHOC(<BookDuoChoice />))

    const soloChoice = page.queryByTestId('DuoChoice1-price')

    const duoChoice = page.queryByTestId('DuoChoice2-price')

    expect(soloChoice).toBeTruthy()
    expect(duoChoice).toBeTruthy()

    expect(page).toMatchSnapshot()
  })

  it('should select an item when pressed', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const page = render(reactQueryProviderHOC(<BookDuoChoice />))

    const soloChoice = page.getByTestId('DuoChoice1-price')

    fireEvent.click(soloChoice)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_QUANTITY', payload: 1 })
  })
  it("should show 'crédit insuffisant' if not enough credit", () => {
    mockCreditOffer = 0
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const page = render(reactQueryProviderHOC(<BookDuoChoice />))

    expect(page.getByTestId('DuoChoice1-price').textContent).toBe('crédit insuffisant')
  })
})
