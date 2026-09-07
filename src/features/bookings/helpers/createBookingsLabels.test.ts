import { createBookingsLabels } from 'features/bookings/helpers/createBookingsLabels'

describe('createLabels', () => {
  it('should return correct labels when count is less than COUNT_MAX', () => {
    const count = 50
    const result = createBookingsLabels(count)

    expect(result).toEqual({
      fullCountLabel: '50',
      accessibilityLabel: '50',
    })
  })

  it('should return correct labels when count is equal to COUNT_MAX for "réservations"', () => {
    const count = 100
    const result = createBookingsLabels(count)

    expect(result).toEqual({
      fullCountLabel: '99+',
      accessibilityLabel: 'Plus de 99 réservations',
    })
  })

  it('should return correct labels when count is greater than COUNT_MAX for "réservations"', () => {
    const count = 150
    const result = createBookingsLabels(count)

    expect(result).toEqual({
      fullCountLabel: '99+',
      accessibilityLabel: 'Plus de 99 réservations',
    })
  })

  it('should return correct labels when count is zero', () => {
    const count = 0
    const result = createBookingsLabels(count)

    expect(result).toEqual({
      fullCountLabel: '0',
      accessibilityLabel: '0',
    })
  })
})
