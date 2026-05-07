import { getFormattedHour } from 'features/bookOffer/helpers/getFormattedHour'

describe('getFormattedHour', () => {
  it('should format an ISO date hour with h separator', () => {
    expect(getFormattedHour('2023-04-01T20:00:00Z')).toBe('20h00')
  })

  it('should keep minutes when formatting an ISO date hour', () => {
    expect(getFormattedHour('2023-04-01T20:05:00Z')).toBe('20h05')
  })

  it('should return an empty string when hour is null', () => {
    expect(getFormattedHour(null)).toBe('')
  })

  it('should return an empty string when hour is undefined', () => {
    expect(getFormattedHour(undefined)).toBe('')
  })
})
