import mockdate from 'mockdate'

import { initialBookingState, bookOfferReducer, Step } from './reducer'

const Today = new Date(2020, 10, 1)

describe('Book Offer reducer', () => {
  beforeAll(() => {
    mockdate.set(Today)
  })

  const state = initialBookingState
  it('should handle SET_OFFER_ID', () => {
    const newState = bookOfferReducer(state, { type: 'SET_OFFER_ID', payload: 20 })
    expect(newState).toStrictEqual({ ...state, offerId: 20 })
  })

  it('should handle CHANGE_STEP', () => {
    let newState = bookOfferReducer(state, { type: 'CHANGE_STEP', payload: Step.DATE })
    expect(newState.step).toStrictEqual(Step.DATE)

    newState = bookOfferReducer(newState, { type: 'CHANGE_STEP', payload: Step.HOUR })
    expect(newState.step).toStrictEqual(Step.HOUR)

    newState = bookOfferReducer(newState, { type: 'CHANGE_STEP', payload: Step.DUO })
    expect(newState.step).toStrictEqual(Step.DUO)

    newState = bookOfferReducer(newState, { type: 'CHANGE_STEP', payload: Step.PRE_VALIDATION })
    expect(newState.step).toStrictEqual(Step.PRE_VALIDATION)
  })

  it('should handle SELECT_DATE', () => {
    const newState = bookOfferReducer(state, { type: 'SELECT_DATE', payload: Today })
    expect(newState.date).toStrictEqual(Today)
  })

  it('should handle SELECT_STOCK and RESET_STOCK', () => {
    let newState = bookOfferReducer(state, { type: 'SELECT_STOCK', payload: 123 })
    expect(newState.stockId).toStrictEqual(123)

    newState = bookOfferReducer(newState, { type: 'RESET_STOCK' })
    expect(newState.stockId).toBeUndefined()
  })

  it('should handle SELECT_QUANTITY and RESET_QUANTITY', () => {
    let newState = bookOfferReducer(state, { type: 'SELECT_QUANTITY', payload: 1 })
    expect(newState.quantity).toStrictEqual(1)

    newState = bookOfferReducer(newState, { type: 'SELECT_QUANTITY', payload: 2 })
    expect(newState.quantity).toStrictEqual(2)

    newState = bookOfferReducer(newState, { type: 'RESET_QUANTITY' })
    expect(newState.quantity).toBeUndefined()
  })

  it('should handle VALIDATE_OPTIONS', () => {
    const newState = bookOfferReducer(state, { type: 'VALIDATE_OPTIONS' })
    expect(newState.step).toStrictEqual(Step.CONFIRMATION)
  })

  it('should handle SELECT_HOUR', () => {
    const newState = bookOfferReducer(state, {
      type: 'SELECT_HOUR',
      payload: '2023-03-01T20:00:00Z',
    })
    expect(newState.hour).toStrictEqual('2023-03-01T20:00:00Z')
  })
})
