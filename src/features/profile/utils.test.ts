import { computeEligibilityExpiracy } from './utils'

describe('computeEligibilityExpiracy', () => {
  it.each([
    // [birthday, expiracy]
    ['2003-01-13T00:00:00', '2022-01-12T23:59:59.000Z'], // check year variation
    ['2003-02-01T00:00:00', '2022-01-31T23:59:59.000Z'], // check month variation
  ])('', (birthday, expectedExpiracy) => {
    const expiracy = computeEligibilityExpiracy(birthday)

    expect(expiracy.toISOString()).toEqual(expectedExpiracy)
  })
})
