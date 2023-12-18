import { sanitizeTitle } from './sanitizeTitle'

describe.each([
  ['lorem ipsum', 'Lorem ipsum'],
  ['Lorem', 'Lorem'],
  ['LOREM', 'LOREM'],
  [' lorem', 'Lorem'],
  ['4orem', '4orem'],
  [' ', ''],
  ['', ''],
])('sanitizeTitle(%s)', (a, expected) => {
  test(`should return ${expected}`, () => {
    expect(sanitizeTitle(a)).toEqual(expected)
  })
})
