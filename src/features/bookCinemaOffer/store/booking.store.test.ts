import {
  bookingActions,
  bookingSelectors,
  bookingStore,
  defaultBookingState,
} from './booking.store'

const startDuoBooking = () =>
  bookingActions.startBooking({
    offerId: 1,
    stockId: 2,
    hour: '2026-10-20T20:00:00Z',
    steps: ['duo', 'confirmation'],
  })

describe('bookingStore', () => {
  beforeEach(() => {
    bookingActions.reset()
  })

  it('should initialize booking at the first step of the flow', () => {
    startDuoBooking()

    expect(bookingStore.store.getState()).toEqual({
      ...defaultBookingState,
      offerId: 1,
      stockId: 2,
      hour: '2026-10-20T20:00:00Z',
      steps: ['duo', 'confirmation'],
      currentStep: 'duo',
    })
    expect(bookingSelectors.selectCurrentStep()).toBe('duo')
    expect(bookingSelectors.selectCanGoBack()).toBe(false)
  })

  it('should default quantity to 1 when the flow has no duo step', () => {
    bookingActions.startBooking({
      offerId: 1,
      stockId: 2,
      hour: '2026-10-20T20:00:00Z',
      steps: ['confirmation'],
    })

    expect(bookingSelectors.selectCurrentStep()).toBe('confirmation')
    expect(bookingSelectors.selectQuantity()).toBe(1)
  })

  it('should navigate within the flow bounds', () => {
    startDuoBooking()

    bookingActions.goToNextStep()

    expect(bookingSelectors.selectCurrentStep()).toBe('confirmation')
    expect(bookingSelectors.selectCanGoBack()).toBe(true)

    bookingActions.goToNextStep()

    expect(bookingSelectors.selectCurrentStep()).toBe('confirmation')

    bookingActions.goToPreviousStep()

    expect(bookingSelectors.selectCurrentStep()).toBe('duo')

    bookingActions.goToPreviousStep()

    expect(bookingSelectors.selectCurrentStep()).toBe('duo')
  })

  it('should reset downstream selections when selecting a date', () => {
    bookingActions.startBooking({
      offerId: 1,
      steps: ['date', 'hour', 'duo', 'confirmation'],
    })
    bookingActions.selectDate('2026-10-20')
    bookingActions.selectStock({
      stockId: 2,
      hour: '2026-10-20T20:00:00Z',
    })
    bookingActions.selectQuantity(2)

    bookingActions.selectDate('2026-10-21')

    expect(bookingSelectors.selectDate()).toBe('2026-10-21')
    expect(bookingSelectors.selectHour()).toBeUndefined()
    expect(bookingSelectors.selectStockId()).toBeUndefined()
    expect(bookingSelectors.selectQuantity()).toBeUndefined()
  })

  it('should keep quantity at 1 when selecting a date in a flow without duo', () => {
    bookingActions.startBooking({
      offerId: 1,
      steps: ['date', 'hour', 'confirmation'],
    })

    bookingActions.selectDate('2026-10-20')

    expect(bookingSelectors.selectQuantity()).toBe(1)
  })

  it('should set hour and stock when selecting a stock', () => {
    bookingActions.startBooking({ offerId: 1, steps: ['date', 'hour', 'confirmation'] })
    bookingActions.selectDate('2026-10-20')

    bookingActions.selectStock({
      stockId: 2,
      hour: '2026-10-20T20:00:00Z',
    })

    expect(bookingSelectors.selectHour()).toBe('2026-10-20T20:00:00Z')
    expect(bookingSelectors.selectStockId()).toBe(2)
  })

  it('should reset state', () => {
    startDuoBooking()

    bookingActions.reset()

    expect(bookingStore.store.getState()).toEqual(defaultBookingState)
  })
})
