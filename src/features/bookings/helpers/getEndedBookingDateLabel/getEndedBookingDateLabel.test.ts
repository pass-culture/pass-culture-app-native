import { getEndedBookingDateLabel } from 'features/bookings/helpers/getEndedBookingDateLabel/getEndedBookingDateLabel'

describe('getEndedBookingDateLabel', () => {
  it('should return the formatted date with date used if provided', () => {
    const label = getEndedBookingDateLabel(null, '2024-11-19')

    expect(label).toEqual('le 19/11/2024')
  })

  it('should return the formatted date with cancellation date if provided and date used not provided', () => {
    const result = getEndedBookingDateLabel('2024-11-18', null)

    expect(result).toEqual('le 18/11/2024')
  })

  it('should return the formatted date with date used if provided and cancellation date provided too', () => {
    const result = getEndedBookingDateLabel('2024-11-18', '2024-11-19')

    expect(result).toEqual('le 19/11/2024')
  })

  it('should return null when both cancellation date and date used are null', () => {
    const result = getEndedBookingDateLabel(null, null)

    expect(result).toBeNull()
  })

  it('should return null when both cancellation date and date used are undefined', () => {
    const result = getEndedBookingDateLabel()

    expect(result).toBeNull()
  })

  it('should return null when both cancellation date and date used are empty strings', () => {
    const result = getEndedBookingDateLabel('', '')

    expect(result).toBeNull()
  })
})
