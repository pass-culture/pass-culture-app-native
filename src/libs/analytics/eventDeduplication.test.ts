import { isDuplicateEvent, resetDedupCache } from './eventDeduplication'

describe('eventDeduplication', () => {
  beforeEach(() => {
    resetDedupCache()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should let a unique event pass', () => {
    expect(isDuplicateEvent('ConsultOffer', { offerId: '123' })).toBe(false)
  })

  it('should block the same event within the dedup window', () => {
    isDuplicateEvent('ConsultOffer', { offerId: '123' })

    expect(isDuplicateEvent('ConsultOffer', { offerId: '123' })).toBe(true)
  })

  it('should let the same event pass after the dedup window expires', () => {
    isDuplicateEvent('ConsultOffer', { offerId: '123' })

    jest.advanceTimersByTime(1001)

    expect(isDuplicateEvent('ConsultOffer', { offerId: '123' })).toBe(false)
  })

  it('should let two different events pass', () => {
    expect(isDuplicateEvent('ConsultOffer', { offerId: '123' })).toBe(false)
    expect(isDuplicateEvent('ConsultVenue', { venueId: '456' })).toBe(false)
  })

  it('should let the same event with different params pass', () => {
    expect(isDuplicateEvent('ConsultOffer', { offerId: '123' })).toBe(false)
    expect(isDuplicateEvent('ConsultOffer', { offerId: '456' })).toBe(false)
  })

  it('should deduplicate regardless of params key order', () => {
    expect(isDuplicateEvent('ConsultOffer', { offerId: '123', from: 'deeplink' })).toBe(false)
    expect(isDuplicateEvent('ConsultOffer', { from: 'deeplink', offerId: '123' })).toBe(true)
  })

  it('should handle events without params', () => {
    expect(isDuplicateEvent('AcceptNotifications')).toBe(false)
    expect(isDuplicateEvent('AcceptNotifications')).toBe(true)
  })

  it('should handle events with undefined params', () => {
    expect(isDuplicateEvent('AcceptNotifications', undefined)).toBe(false)
    expect(isDuplicateEvent('AcceptNotifications', undefined)).toBe(true)
  })

  it('should clean up expired entries during cleanup cycle', () => {
    isDuplicateEvent('OldEvent', { id: '1' })

    // Advance past dedup window + cleanup interval
    jest.advanceTimersByTime(6000)

    // Trigger cleanup by calling isDuplicateEvent
    isDuplicateEvent('NewEvent', { id: '2' })

    // OldEvent should no longer be tracked — it should pass again
    expect(isDuplicateEvent('OldEvent', { id: '1' })).toBe(false)
  })

  it('should reset cache correctly', () => {
    isDuplicateEvent('ConsultOffer', { offerId: '123' })

    resetDedupCache()

    expect(isDuplicateEvent('ConsultOffer', { offerId: '123' })).toBe(false)
  })
})
